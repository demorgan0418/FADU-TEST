/**
 * Se dispara cada vez que se escribe el documento "app/estado" (o sea, cada vez que
 * alguien hace cualquier acción en la app). Compara el estado anterior contra el nuevo,
 * detecta si apareció un pedido de apertura/cierre NUEVO en alguna puerta, y si es así
 * le manda una notificación push a los celulares del personal de "Pisos" asignado a
 * ese sector.
 *
 * IMPORTANTE (regla de oro del proyecto): esta función solo LEE el documento para decidir
 * a quién avisar. Nunca lo escribe, nunca reemplaza ni modifica nada de los datos guardados.
 */
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

exports.notifyOnRequest = onDocumentWritten("app/estado", async (event) => {
  if (!event.data || !event.data.after || !event.data.after.exists) {
    console.log("Sin datos 'after', se ignora.");
    return;
  }

  const before = event.data.before && event.data.before.exists ? event.data.before.data() : {};
  const after = event.data.after.data();
  const beforeDoors = before.doors || {};
  const afterDoors = after.doors || {};
  const staff = after.staff || {};
  const messaging = getMessaging();
  const sends = [];
  let newRequestsFound = 0;

  for (const doorId of Object.keys(afterDoors)) {
    const a = afterDoors[doorId];
    const b = beforeDoors[doorId];
    const newPr = a && a.pendingRequest;
    const oldPr = b && b.pendingRequest;
    // "es nuevo" = hay pedido ahora y (antes no había, o el horario del pedido cambió)
    const isNew = newPr && (!oldPr || oldPr.requestedAt !== newPr.requestedAt);
    if (!isNew) continue;

    newRequestsFound++;
    console.log(`Pedido nuevo detectado: ${doorId} (sector ${a.sector}) — ${newPr.type} pedido por ${newPr.requestedBy}`);

    const title = "Control Seguridad FADU";
    const body = `${newPr.requestedBy} pide ${newPr.type === "open" ? "abrir" : "cerrar"} ${a.label}`;

    // personal de "pisos" asignado al sector de esta puerta
    const targets = Object.entries(staff).filter(
      ([, s]) => s && s.role === "recorrido" && Array.isArray(s.zones) && s.zones.includes(a.sector)
    );
    console.log(`  -> ${targets.length} persona(s) de Pisos asignada(s) al sector ${a.sector}: ${targets.map(([name]) => name).join(", ") || "(ninguna)"}`);

    for (const [name, s] of targets) {
      const tokens = Array.isArray(s.fcmTokens) ? s.fcmTokens : [];
      console.log(`     ${name} tiene ${tokens.length} token(s) guardado(s).`);
      for (const token of tokens) {
        sends.push(
          messaging
            .send({
              token,
              notification: { title, body },
              webpush: {
                notification: { icon: "/icons/icon-192.png" },
                fcmOptions: { link: "/" },
              },
            })
            .then(() => console.log(`     OK: push enviado a ${name}.`))
            .catch((err) => {
              console.error(`     ERROR enviando push a ${name}:`, err.message);
            })
        );
      }
    }
  }

  if (newRequestsFound === 0) console.log("No se detectó ningún pedido nuevo en esta escritura (puede ser otra acción, como marcar una puerta o editar personal).");

  await Promise.all(sends);
});
