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

## Alternativa con Render

El proyecto tambien incluye `server.js` y `render.yaml` para desplegarlo como web service Node en Render. Ese camino solo es necesario si mas adelante se quiere usar backend propio en vez de Google Apps Script.
