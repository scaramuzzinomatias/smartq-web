# SmartQ Web

Landing institucional de SmartQ.

## Estructura

```
index.html
css/style.css
js/script.js
server.js
package.json
assets/
```

## Ejecutar localmente

```bash
npm install
cp .env.example .env
# completar SMTP_USER, SMTP_PASS (Brevo), CONTACT_TO, CONTACT_FROM en .env
npm start
```

Abrir:

```
http://localhost:3000
```

## Formulario de contacto

El formulario envía consultas por email vía SMTP (Brevo) usando `server.js`
(Node + Express + Nodemailer), en el endpoint `POST /api/contact`.

Variables de entorno requeridas (ver `.env.example`):

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`
- `SMTP_USER`, `SMTP_PASS` (credenciales SMTP de Brevo, no la contraseña de la cuenta)
- `CONTACT_TO` (a dónde llegan las consultas)
- `CONTACT_FROM` (remitente verificado en Brevo)

Para probar sin enviar emails reales, poner `MAIL_DRY_RUN=true` en `.env`
(los datos del formulario quedan logueados en la consola en vez de enviarse).

## Despliegue

Este proyecto necesita un proceso Node corriendo (no es un sitio 100% estático,
por el endpoint `/api/contact`). Pensado para desplegarse en un VPS propio:

1. Subir el proyecto al VPS.
2. `npm install`
3. Configurar `.env` con las credenciales de Brevo.
4. Mantenerlo corriendo con `pm2 start server.js --name smartq` (o el gestor de procesos que prefieras).
5. Configurar Nginx como reverse proxy del dominio hacia el puerto definido en `.env`, para que el frontend pueda pegarle a `/api/contact` en el mismo origen.
6. `sudo certbot --nginx -d tudominio.com.ar` para SSL.
