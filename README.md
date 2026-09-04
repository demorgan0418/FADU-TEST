# Planilla de Llaves — todo desde el celular, gratis

No hace falta computadora ni instalar nada. Se hace todo desde el navegador (Chrome funciona mejor que otros para esto).

## Paso 1 — Crear el proyecto en Firebase (la base de datos)
1. Desde el celular, entrá a https://console.firebase.google.com
2. Iniciá sesión con una cuenta de Google (puede ser la tuya).
3. "Agregar proyecto" → nombre, ej: `colegio-llaves` → seguís los pasos (podés desactivar Google Analytics).

## Paso 2 — Activar el login sin contraseña
1. Menú (☰, arriba a la izquierda) → **Compilación → Authentication → Comenzar**.
2. Pestaña "Sign-in method" → **Anónimo** → activar.

## Paso 3 — Activar la base de datos
1. Menú → **Compilación → Firestore Database → Crear base de datos**.
2. Modo **producción**, región más cercana (ej: `southamerica-east1`).
3. Pestaña "Reglas" → borrá lo que hay y pegá esto → "Publicar":
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Paso 4 — Conseguir tu configuración
1. Ícono de tuerca (⚙️, arriba a la izquierda) → **Configuración del proyecto**.
2. Bajá a "Tus apps" → tocá el ícono `</>` (Web) → nombre: `web` → "Registrar app".
3. Te va a mostrar un bloque de código `firebaseConfig = {...}` con 6 valores. Dejalo abierto o hacé captura, lo vas a necesitar en el paso 6.

## Paso 5 — Crear la cuenta de GitHub y subir la app
1. Andá a https://github.com y create una cuenta gratis (si no tenés).
2. Arriba a la derecha, el botón "+" → **New repository**.
3. Nombre: `llaves-colegio` → marcá "Public" → "Create repository".
4. Adentro del repo recién creado, tocá **"uploading an existing file"** (o "Add file → Upload files").
5. Subí **todos** los archivos que están dentro de la carpeta `public` de este zip (index.html, manifest.json, sw.js, y la carpeta `icons` con los 2 PNG) — arrastralos o elegilos desde "Choose your files".
6. Abajo, "Commit changes" (podés dejar todo como está y confirmar).

## Paso 6 — Pegar tu configuración de Firebase
1. Dentro del repo en GitHub, tocá el archivo `index.html`.
2. Tocá el ícono del lápiz (✏️ Edit) arriba a la derecha.
3. Buscá (con la lupa de buscar del navegador) el texto `TU_API_KEY` — vas a ver un bloque así:
```js
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  ...
};
```
4. Reemplazá cada valor por el que te mostró Firebase en el Paso 4.
5. Abajo, "Commit changes" para guardar.

## Paso 7 — Activar GitHub Pages (esto le da la dirección web)
1. En el repo, pestaña **"Settings"**.
2. Menú lateral → **"Pages"**.
3. En "Branch" elegí `main` y carpeta `/ (root)` → "Save".

   **Importante:** como los archivos están dentro de una carpeta `public`, o bien subilos directamente a la raíz del repo (sin la carpeta `public` alrededor), o en "Pages" elegí la opción de carpeta si te la ofrece. Lo más simple: al subir en el Paso 5, subí el *contenido* de `public` directo a la raíz del repositorio, no la carpeta en sí.
4. Esperá 1-2 minutos y arriba te va a aparecer el link, algo como:
   `https://TU-USUARIO.github.io/llaves-colegio/`

## Paso 8 — Instalar en el celular
- Abrís ese link en Chrome (Android) o Safari (iPhone).
- Chrome: menú (⋮) → "Agregar a pantalla de inicio".
- Safari: botón compartir (□↑) → "Agregar a pantalla de inicio".
- Ya queda con ícono propio, como una app instalada.

## Para repartirlo a los demás
Les pasás el mismo link (`https://TU-USUARIO.github.io/llaves-colegio/`) y cada uno hace el Paso 8 desde su celular. Todos van a compartir la misma base de datos en tiempo real.

## Costo
$0. Firebase (plan Spark) y GitHub Pages son gratuitos para este volumen de uso, sin tarjeta de crédito.

## Actualizaciones futuras
Cuando te pase una mejora del código, solo hay que volver a subir el archivo cambiado en GitHub (Paso 5, "Upload files" de nuevo) — no hay que reinstalar nada en los celulares.

## Lo que no cubre esta versión
- Notificación con la app *completamente cerrada* (necesita un servidor de por medio — se puede sumar más adelante).
- PIN o contraseña individual (por ahora es solo por nombre, como pediste).
