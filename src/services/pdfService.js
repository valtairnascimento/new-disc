const PDFDocument = require("pdfkit");

exports.generatePDFContent = async (result, profileData) => {
  return new Promise((resolve, reject) => {
    const { profile, primaryLanguage, scores, resultId, name } = result;
    const { description, strengths, weaknesses } = profileData;

    console.log("Gerando PDF para:", {
      resultId,
      name,
      profile,
      primaryLanguage,
    });

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      console.log("PDF finalizado, tamanho:", pdfBuffer.length);
      if (pdfBuffer.length === 0) {
        reject(new Error("PDF buffer vazio"));
      } else {
        resolve(pdfBuffer);
      }
    });
    doc.on("error", (err) => {
      console.error("Erro ao gerar PDF:", err);
      reject(err);
    });

    doc.fontSize(20).text("Relatório de Perfil", { align: "center" });
    doc.moveDown(1);
    doc.fontSize(14).text(`Nome: ${name}`, { align: "left" });
    doc.text(`Perfil: ${profile || primaryLanguage}`, { align: "left" });
    doc.text(`ID do Resultado: ${resultId}`);
    doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`);
    doc.moveDown(2);

    doc.fontSize(16).text("Descrição do Perfil", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(description, { align: "justify" });
    doc.moveDown(2);

    doc.fontSize(16).text("Pontuações", { underline: true });
    doc.moveDown(0.5);
    Object.keys(scores).forEach((key) => {
      doc.fontSize(12).text(`${key}: ${scores[key].toFixed(2)}%`);
    });
    doc.moveDown(2);

    doc.fontSize(16).text("Pontos Fortes", { underline: true });
    doc.moveDown(0.5);
    strengths.forEach((strength) => doc.fontSize(12).text(`• ${strength}`));
    doc.moveDown(2);

    doc.fontSize(16).text("Áreas de Melhoria", { underline: true });
    doc.moveDown(0.5);
    weaknesses.forEach((weakness) => doc.fontSize(12).text(`• ${weakness}`));

    doc.end();
  });
};
