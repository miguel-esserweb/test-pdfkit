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

const createTransporter = () => {
  return nodemailer.createTransport({
    host: HOST,
    port: PORT,
    secure: false,
    auth: {
      user: USER,
      pass: PASS,
    },
  });
};

const sendEmail = async (task, retries = 3) => {
  const transporter = createTransporter();
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Enviando correo a: ${task.client} (Intento ${attempt})`);
      
      const url = `${API_URL}/operations?shows=30&userId=${task.id}&orderBy=operationDate&dateAfter=2024-02-06&dateBefore=2024-08-06&sortBy=ascending&report=true`;
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      
      const pdfBuffer = await getPdf(task.client, data);
      
      await transporter.sendMail({
        from: { name: FROM_NAME, address: FROM_EMAIL },
        to: [task.mail],
        subject: `Reporte para ${task.client}`,
        text: "Reporte del mes",
        html: "<b>Este es el reporte mensual</b>",
        attachments: [{
          filename: `Reporte ${task.client}.pdf`,
          content: pdfBuffer,
        }],
      });
      
      console.log(`Correo enviado exitosamente a ${task.client}`);
      return;
    } catch (error) {
      console.error(`Error al enviar correo a ${task.client}:`, error.message);
      if (attempt === retries) {
        console.log(`Falló el envío del correo a ${task.client} después de ${retries} intentos`);
      }
    }
  }
};

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

export async function GET(req, res) {
  try {
    const { data } = await axios.get(`${LOCAL_API_URL}/send`);
    
    if (data.length > 0) {
      await sendEmail({
        id: data[0].id,
        client: data[0].cliente,
        mail: data[0].correo
      });
    }

    if (data.length > 1) {
      for (let i = 1; i < data.length; i++) {
        const task = {
          id: data[i].id,
          client: data[i].cliente,
          mail: data[i].correo
        };
        
        setTimeout(() => {
          sendEmail(task).catch(console.error);
        }, i * 1000);
      }
    }

    return new Response(`Proceso de envío de correos iniciado. Se procesarán ${data.length} correos.`, { status: 200 });
  } catch (error) {
    console.error("Error al iniciar el proceso de envío:", error);
    return new Response("Error al iniciar el proceso de envío", { status: 500 });
  }
}

export const revalidate = 0;