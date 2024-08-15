import PDFDocument from "pdfkit";

export function getPdf(name){
    return new Promise((resolve, reject) => {
        const chunks = [];
        const doc = new PDFDocument();
    
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);
    
    
        doc
          .fontSize(20)
          .fill("#1D1B4B")
          .text("Header Title", 50, 50)
          .fontSize(15)
          .text("Estado de cuenta", 50, 100)
          .moveDown()
          .fontSize(12)
          .text("Jose luis Rodriguez", 50, 120)
          .moveDown()
          .text("Saldo actual: $0.00", 50, 140);
    
        doc
          .fontSize(15)
          .fillColor("#000")
          .text("Operaciones de los últimos 30 días", 50, 180)
          .fontSize(12)
          .text("Fecha: 06/08/2024", 50, 200);

          
          
          doc
          .fontSize(15)
          .fillColor("#000")
          .moveDown()
          .text(name, 50, 250)
    
        doc
          .moveDown(1.5)
          .fontSize(12)
          .fillColor("#000")
          .text("ID", 50, 240)
          .text("FECHA", 100, 240)
          .text("TIPO", 150, 240)
          .text("MONTO", 200, 240)
          .text("TASA", 250, 240)
          .text("ENTRADA", 300, 240)
          .text("SALIDA", 370, 240)
          .text("TOTAL", 450, 240);
    
        const rows = [
          {
            id: 1,
            date: "6/8/2024",
            type: "Compra",
            amount: "-",
            rate: "37.74",
            entrada: "$100",
            salida: "3,774.00",
            total: "$0.00",
          },
          {
            id: 2,
            date: "6/8/2024",
            type: "Venta",
            amount: "-",
            rate: "37.74",
            entrada: "$100",
            salida: "3,774.00",
            total: "$0.00",
          },
          {
            id: 3,
            date: "6/8/2024",
            type: "Retiro",
            amount: "-",
            rate: "37.74",
            entrada: "$100",
            salida: "3,774.00",
            total: "$0.00",
          },
          {
            id: 4,
            date: "6/8/2024",
            type: "Cambio",
            amount: "-",
            rate: "37.74",
            entrada: "$100",
            salida: "3,774.00",
            total: "$0.00",
          },
        ];
    
        let yPosition = 260;
        rows.forEach((row) => {
          doc
            .fontSize(12)
            .fillColor("#000")
            .text(row.id, 50, yPosition)
            .text(row.date, 100, yPosition)
            .fillColor(getColorByType(row.type)) // Adjust color based on type
            .text(row.type, 150, yPosition)
            .fillColor("#000")
            .text(row.amount, 200, yPosition)
            .text(row.rate, 250, yPosition)
            .text(row.entrada, 300, yPosition)
            .text(row.salida, 370, yPosition)
            .text(row.total, 450, yPosition);
    
          yPosition += 20;
        });
    
        // Footer with summary boxes
        doc
          .rect(50, yPosition + 20, 150, 50)
          .stroke()
          .fontSize(12)
          .fillColor("#000")
          .text("Compras", 60, yPosition + 30)
          .text("Monto", 60, yPosition + 50);
    
        doc
          .rect(250, yPosition + 20, 150, 50)
          .stroke()
          .text("Ventas", 260, yPosition + 30)
          .text("Monto", 260, yPosition + 50);
    
        doc
          .rect(450, yPosition + 20, 150, 50)
          .stroke()
          .text("Cambios", 460, yPosition + 30)
          .text("Monto", 460, yPosition + 50);
    
        function getColorByType(type) {
          switch (type.trim()) {
            case "Venta":
              return "#ef4444";
            case "Cambio":
              return "#3b82f6";
            case "Retiro":
              return "#eab308";
            default:
              return "#22c55e";
          }
        }
    
        doc.end();
      });
}