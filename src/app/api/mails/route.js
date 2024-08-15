import { queue } from "@/utils/queue";

export async function GET(req, res) {
  try {
    await queue()
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