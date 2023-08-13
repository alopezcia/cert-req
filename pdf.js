const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a document
const doc = new PDFDocument({
        size: 'A4', 
        margins: {
            top: 20,
            bottom: 20,
            left: 20,
            right: 40
            }});

// Pipe its output somewhere, like to a file or HTTP response
// See below for browser usage
doc.pipe(fs.createWriteStream('output.pdf'));

// Medidas del A4
// doc.polygon([2, 2], [593, 2], [593, 840], [2, 840]);
// doc.stroke();

// Embed a font, set the font size, and render some text
// doc
//   .font('Helvetica-Bold')
//   .fontSize(14)
//   .text('FICHA DE INSCRIPCIÓN CATEQUESIS DE LA COMUNIDAD 2022/2023', {
//     align: 'center'
//    });

// // Add an image, constrain it to a given size, and center it vertically and horizontally
// doc.image('public/iglesia_parroquial_sant_vicent_ferrer.png', 10, 35, {
//   fit: [5, 37],
//   align: 'center',
//   valign: 'center'
//});

doc.image('public/hoja.png', 0, 0, {
    fit: [595, 841],
    align: 'center',
    valign: 'center'
  });

  // Parroquia
  doc
    .font('Helvetica')
    .fontSize(10)
    .text('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 179, 45 );

  // Nivel
  doc.text('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 179, 70);

  // Apellidos niñ@
  doc.text('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 110, 90);

  // Nombre  niñ@
  doc.text('XXXXXXXXXXXXXXXXX', 435, 90);

  // parroquia bautizo
  doc.text('XXXXXXXXXXXXXXXX', 143, 116);

  // fecha nacimiento
  doc.text('99/99/9999', 488, 116);
  
  // colegio actual
  doc.text('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 90, 140);

  // curso escolar
  doc.text('XXXXXXXXXXXXXXXX', 384, 140);

  // nombre del profesor de religión
  doc.text('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 144, 166);

  // apellidos padre
  doc.text('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 110, 190);

  // nombre padre
  doc.text('XXXXXXXXXXXXXXXXXX', 430, 190);

  // telefono padre 
  doc.text('XXXXXXXXXXXXXXXXXXXXXXXX', 144, 216);

  // dni padre 
  doc.text('XXXXXXXXXXXXXXXXXXXXXXX', 395, 216);

  // apellidos madre 
  doc.text('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 115, 242);

  // nombre madre
  doc.text('XXXXXXXXXXXXXXXXXX', 430, 242);

  // telefono madre 
  doc.text('XXXXXXXXXXXXXXXXXXXXXXXX', 144, 268);

  // dni madre 
  doc.text('XXXXXXXXXXXXXXXXXXXXXXX', 395, 268);
  
  // dirección
  doc.text('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 76, 294);

  // codigo postal 
  doc.text('XXXXXXXXX', 488, 294);

  // email
  doc.text('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 76, 318);

  // alergias
  doc.text('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 
  28, 352);

  // comentiarios
  doc.text('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 
  28, 410);

  // si , imagen  
  doc.text('X', 469, 471);
  // no , imagen  
  doc.text('X', 520, 471);

  // si , imagen  
  doc.text('X', 469, 496);
  // no , imagen  
  doc.text('X', 520, 496);

  // si , imagen  
  doc.text('X', 469, 520);
  // no , imagen  
  doc.text('X', 520, 520);

  // si , imagen  
  doc.text('X', 469, 548);
  // no , imagen  
  doc.text('X', 520, 548);

  // ACEPTO  
  doc.text('X', 44, 600);

  
  



// Add another page
doc
  .addPage()
  .fontSize(25)
  .text('Here is some vector graphics...', 100, 100);

// Draw a triangle
doc
  .save()
  .moveTo(100, 150)
  .lineTo(100, 250)
  .lineTo(200, 250)
  .fill('#FF3300');

// Apply some transforms and render an SVG path with the 'even-odd' fill rule
doc
  .scale(0.6)
  .translate(470, -380)
  .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
  .fill('red', 'even-odd')
  .restore();

// Add some text with annotations
doc
  .addPage()
  .fillColor('blue')
  .text('Here is a link!', 100, 100)
  .underline(100, 100, 160, 27, { color: '#0000FF' })
  .link(100, 100, 160, 27, 'http://google.com/');

// Finalize PDF file
doc.end();
