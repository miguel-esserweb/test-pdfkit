import { queue } from "@/utils/queue";

export async function GET(req, res) {
  try {
    const pdfBuffer = await queue();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="output.pdf"',
        "Content-Length": pdfBuffer.length,
      },
    });
  } catch (error) {
    console.error("Error generando PDF:", error);
    return new Response("Error generando PDF", { status: 500 });
  }
}