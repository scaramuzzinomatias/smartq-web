const TO_EMAIL = "matias.smartq@gmail.com";
const SUBJECT_PREFIX = "Nueva consulta SmartQ";

function doPost(e) {
  const data = (e && e.parameter) || {};

  if (data._honey) {
    return textResponse("OK");
  }

  const name = clean(data.name);
  const email = clean(data.email);
  const phone = clean(data.phone);
  const message = clean(data.message);
  const source = clean(data.source || "SmartQ Web");
  const page = clean(data.page);
  const sentAt = clean(data.sent_at);

  const subject = `${SUBJECT_PREFIX}: ${name || "sin nombre"}`;
  const body = [
    "Nueva consulta desde la web de SmartQ",
    "",
    `Nombre: ${name}`,
    `Email: ${email}`,
    `Telefono: ${phone}`,
    "",
    "Maquina o servicio:",
    message,
    "",
    `Origen: ${source}`,
    `Pagina: ${page}`,
    `Fecha cliente: ${sentAt}`,
  ].join("\n");

  MailApp.sendEmail({
    to: TO_EMAIL,
    subject,
    body,
    replyTo: email || undefined,
    name: "SmartQ Web",
  });

  return textResponse("OK");
}

function doGet() {
  return textResponse("SmartQ mail endpoint activo. Enviar consultas con POST.");
}

function testSend() {
  return doPost({
    parameter: {
      name: "Prueba SmartQ",
      email: "prueba@smartq.local",
      phone: "",
      message: "Prueba enviada desde Apps Script.",
      source: "Apps Script testSend",
      page: "editor",
      sent_at: new Date().toISOString(),
      _honey: "",
    },
  });
}

function clean(value) {
  return String(value || "").trim().slice(0, 3000);
}

function textResponse(text) {
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.TEXT);
}
