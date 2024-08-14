const PDFDocument = require("pdfkit");
const fs = require("fs");

// Creating a new instance of PDFDocument class
const doc = new PDFDocument();

// Piping the output stream to a file
// named "output.pdf"
doc.pipe(fs.createWriteStream("output.pdf"));

// Setting the fill color to green and
// font size to 30
doc.fillColor("green")
    .fontSize(30)
    .text("GeeksforGeeks");

// Setting the fill color to black and
// font size to 15
doc.fillColor("black")
    .fontSize(15)
    .text("It is the best platform for :- ");

// Adding multiple lines of text to
// the document
doc.text("Programming");
doc.text("Data Structures");
doc.text("Web development");
doc.text("Android development");
doc.text("Artificial intelligence, etc.");

// Ending the document
doc.end();