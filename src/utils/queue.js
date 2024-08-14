import PDFDocument from "pdfkit";

export function queue() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument();

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(30).text("Hola");

    doc.end();
  });
}