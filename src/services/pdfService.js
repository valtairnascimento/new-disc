const PDFDocument = require("pdfkit");

exports.generatePDFContent = async (result, profileData) => {
  try {
    console.log("Gerando PDF para resultado:", result);
    console.log("Dados do perfil:", profileData);

    // Validação inicial
    if (!result || !profileData) {
      throw new Error("Resultado ou dados do perfil ausentes");
    }
    if (!result.name || !result.date) {
      throw new Error("Nome ou data ausentes no resultado");
    }

    const scores = result.scores;
    if (!scores || typeof scores !== "object") {
      throw new Error("Scores ausentes ou em formato inválido");
    }

    const profile = result.profile || result.primaryLanguage || "Desconhecido";
    const description = profileData.description || "Sem descrição disponível";

    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));

    return new Promise((resolve, reject) => {
      doc.on("end", () => {
        console.log("PDF finalizado");
        resolve(Buffer.concat(buffers));
      });

      doc.on("error", (err) => {
        console.error("Erro durante a criação do PDF:", err);
        reject(err);
      });

      // Conteúdo do PDF
      doc.fontSize(20).text("Relatório de Resultado", { align: "center" });
      doc.moveDown();

      doc.fontSize(16).text(`Nome: ${result.name}`);
      doc
        .fontSize(16)
        .text(`Data: ${new Date(result.date).toLocaleDateString()}`);
      doc.moveDown();

      doc.fontSize(16).text(`Perfil: ${profile}`);
      doc.fontSize(12).text(`Descrição: ${description}`);
      doc.moveDown();

      doc.fontSize(14).text("Distribuição das Respostas:");
      Object.entries(scores).forEach(([key, value]) => {
        doc.fontSize(12).text(`${key}: ${value}`);
      });

      doc.end();
    });
  } catch (err) {
    console.error("Erro ao gerar PDF:", {
      message: err.message,
      stack: err.stack,
      result,
      profileData,
    });
    throw err;
  }
};
