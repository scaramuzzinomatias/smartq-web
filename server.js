const path = require("node:path");
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 3000;
const publicDir = __dirname;

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: false, limit: "32kb" }));
app.use(express.static(publicDir, { extensions: ["html"] }));

const requiredFields = ["name", "email", "message"];

const clean = (value) => String(value || "").trim();

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const escapeHtml = (value) =>
  clean(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getSmtpConfig = () => {
  const smtpPort = Number(process.env.SMTP_PORT || 587);

  return {
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: String(process.env.SMTP_SECURE || "").toLowerCase() === "true" || smtpPort === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
};

const hasMailConfig = () =>
  Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.CONTACT_TO
  );

app.post("/api/contact", async (req, res) => {
  const payload = {
    name: clean(req.body.name),
    email: clean(req.body.email),
    phone: clean(req.body.phone),
    message: clean(req.body.message),
    honey: clean(req.body._honey),
  };

  if (payload.honey) {
    return res.status(200).json({ ok: true });
  }

  const missingField = requiredFields.find((field) => !payload[field]);
  if (missingField) {
    return res.status(400).json({ ok: false, message: "Completá los campos obligatorios." });
  }

  if (!isValidEmail(payload.email)) {
    return res.status(400).json({ ok: false, message: "Ingresá un email válido." });
  }

  const plainText = [
    "Nueva consulta desde la web SmartQ",
    "",
    `Nombre: ${payload.name}`,
    `Email: ${payload.email}`,
    `Telefono: ${payload.phone || "No informado"}`,
    "",
    "Maquina o servicio:",
    payload.message,
  ].join("\n");

  const html = `
    <h2>Nueva consulta desde la web SmartQ</h2>
    <table cellpadding="8" cellspacing="0" border="0">
      <tr><td><strong>Nombre</strong></td><td>${escapeHtml(payload.name)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(payload.email)}</td></tr>
      <tr><td><strong>Telefono</strong></td><td>${escapeHtml(payload.phone || "No informado")}</td></tr>
      <tr><td><strong>Maquina o servicio</strong></td><td>${escapeHtml(payload.message).replaceAll("\n", "<br>")}</td></tr>
    </table>
  `;

  if (String(process.env.MAIL_DRY_RUN || "").toLowerCase() === "true") {
    console.log(plainText);
    return res.status(200).json({ ok: true });
  }

  if (!hasMailConfig()) {
    console.error("SmartQ: faltan variables SMTP para enviar el formulario.");
    return res.status(500).json({ ok: false, message: "El formulario no está configurado." });
  }

  try {
    const transporter = nodemailer.createTransport(getSmtpConfig());
    await transporter.sendMail({
      from: process.env.CONTACT_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_TO,
      replyTo: payload.email,
      subject: "Nueva consulta desde SmartQ Web",
      text: plainText,
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("SmartQ: error enviando email.", error);
    return res.status(500).json({ ok: false, message: "No se pudo enviar la consulta." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(port, () => {
  console.log(`SmartQ web escuchando en http://localhost:${port}`);
});
