import { getPdf } from "@/utils/getPdf";
import axios from "axios";
const nodemailer = require("nodemailer");

const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASSWORD;
const HOST = process.env.SMTP_HOST;
const PORT = process.env.SMTP_PORT;
const FROM_EMAIL = process.env.EMAILS_FROM_EMAIL;
const FROM_NAME = process.env.EMAILS_FROM_NAME;
const LOCAL_API = process.env.LOCAL_API_URL;
const API_URL = process.env.API_URL;
const TOKEN = process.env.TOKEN_BEARER;

class JobQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  enqueue(job) {
    this.queue.push(job);
    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const currentJob = this.queue.shift();
      try {
        await currentJob();
      } catch (error) {
        console.error("Error en el trabajo:", error);
      }
    }

    this.isProcessing = false;
  }
}

export async function GET() {
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
    tls: {
      rejectUnauthorized: true,
    },
  });

  try {
    const emails = await axios
      .get(`${LOCAL_API}/send`)
      .then((res) => res.data)
      .catch((err) => {
        console.error("Error fetching emails:", err);
        throw err;
      });

    console.log("Correos obtenidos:", emails);

    const sendEmail = async (task) => {
      try {
        console.log("Enviando correo a:", task.client);
        const email = await transporter.sendMail({
          from: {
            name: FROM_NAME,
            address: FROM_EMAIL,
          },
          to: [task.mail],
          subject: `Reporte para ${task.client}`,
          text: "Reporte de Prueba",
          html: "**Correo enviado por Miguel**",
        });
        console.log("Correo enviado a", task.client, email.messageId);
        return email;
      } catch (err) {
        console.error("Error al enviar correo:", err);
        throw err;
      }
    };

    if (emails && Array.isArray(emails)) {
      const jobQueue = new JobQueue();

      const emailPromises = emails.map((email) => {
        return new Promise((resolve, reject) => {
          jobQueue.enqueue(async () => {
            try {
              const result = await sendEmail({
                id: email.id,
                client: email.cliente,
                mail: email.correo,
              });
              resolve(result);
            } catch (error) {
              reject(error);
            }
          });
        });
      });

      const responses = await Promise.all(emailPromises);

      return new Response(JSON.stringify(responses), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    console.error("Error en el proceso de envío de correos:", err);
    return new Response("Ocurrió un error al enviar los correos", {
      status: 500,
    });
  }
}

export const maxDuration = 60;
export const revalidate = 0;
