# SmartQ Web

Landing institucional de SmartQ.

## Ejecutar localmente

```powershell
cd "C:\PROYECTOS\SmartQ - Web"
python -m http.server 5173 --bind 127.0.0.1
```

Abrir:

```text
http://127.0.0.1:5173/
```

## Formulario de contacto

El formulario envia consultas mediante Google Apps Script. La URL esta configurada en:

```js
const GOOGLE_SCRIPT_URL = "...";
```

Archivo local de referencia para Apps Script:

```text
google-mail.gs
```

## Publicar con GitHub Pages

1. Crear un repositorio en GitHub, por ejemplo `smartq-web`.
2. Subir este proyecto al repo.
3. En GitHub: `Settings > Pages`.
4. En `Build and deployment`, seleccionar:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Guardar.

La web quedara publicada en una URL similar a:

```text
https://TU_USUARIO.github.io/smartq-web/
```

## Publicar con Render

El proyecto incluye `render.yaml` para publicarlo como **Static Site** en Render.

1. Entrar a Render.
2. Crear un nuevo **Blueprint** o **Static Site** desde el repo de GitHub.
3. Seleccionar este repositorio.
4. Render detecta `render.yaml`.
5. Publicar.

No hace falta configurar variables de entorno para el formulario actual, porque el envio de email usa Google Apps Script desde `script.js`.

`server.js` queda como alternativa futura si se decide usar backend propio en vez de Google Apps Script.
