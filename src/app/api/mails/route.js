import { queue } from "@/utils/queue";
const nodemailer = require("nodemailer");

const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASSWORD;
const HOST = process.env.SMTP_HOST;
const PORT = process.env.SMTP_PORT;
const FROM_EMAIL = process.env.EMAILS_FROM_EMAIL;
const FROM_NAME = process.env.EMAILS_FROM_NAME;

export async function GET(req, res) {
  const transporter = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    starttls: {
      enable: true,
    },
    secure: false,
    auth: {
      user: USER,
      pass: PASS,
    },
  });
  try {
    const pdfBuffer = await queue();

    await transporter.sendMail({
      from: {
        name: FROM_NAME,
        address: FROM_EMAIL,
      },
      to: ["miguel.esserweb@gmail.com"],
      subject: `Reporte para Miguel`,
      text: "Reporte del mes",
      html: "<b>Este es el b</b>",
      attachments: [
        {
          filename: `Reporte.pdf`,
          content: pdfBuffer,
        },
      ],
    });
    return new Response("Se envio el correo", {
      status: 200,
      // headers: {
      //   "Content-Type": "application/pdf",
      //   "Content-Disposition": 'inline; filename="output.pdf"',
      //   "Content-Length": pdfBuffer.length,
      // },
    });
  } catch (error) {
    console.error("Error generando PDF:", error);
    return new Response("Error generando PDF", { status: 500 });
  }
}

export const revalidate = 0