const PDFDocument = require("pdfkit");

function generateLoveReportPDF(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers = [];

    const colors = {
      primary: "#8B5CF6", 
      secondary: "#F3F4F6",
      accent: "#EC4899",  
      text: "#374151",
      lightGray: "#D1D5DB",
      soft: "#FDF2F8"
    };

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const margin = doc.page.margins.left;
    const contentWidth = pageWidth - (margin * 2);

    function setFont(size, bold = false, color = colors.text) {
      doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(size).fillColor(color);
    }

    function addTitle(text, size = 18) {
      setFont(size, true, colors.primary);
      doc.text(text, margin, doc.y, { align: "left", width: contentWidth });
      doc.moveDown(0.5);
    }

    function addText(text, size = 11, color = colors.text) {
      setFont(size, false, color);
      doc.text(text, margin, doc.y, { align: "justify", width: contentWidth });
      doc.moveDown(0.3);
    }

    function addList(items, color = colors.text) {
      setFont(10, false, color);
      items.forEach(item => {
        doc.text(`• ${item}`, margin + 20, doc.y, { width: contentWidth - 20 });
        doc.moveDown(0.2);
      });
      doc.moveDown(0.3);
    }

    function addSeparator() {
      doc.moveDown(0.5);
      doc.strokeColor(colors.lightGray)
         .lineWidth(1)
         .moveTo(margin, doc.y)
         .lineTo(pageWidth - margin, doc.y)
         .stroke();
      doc.moveDown(1);
    }

    function checkPageBreak(requiredHeight = 100) {
      if (doc.y + requiredHeight > pageHeight - margin) {
        doc.addPage();
      }
    }

    function addCover() {
      doc.rect(0, 0, pageWidth, 120).fill(colors.primary);
      setFont(28, true, "white");
      doc.text("Relatório das Linguagens do Amor", margin, 35, {
        width: contentWidth,
        align: "center"
      });

      doc.fillColor(colors.accent).circle(pageWidth - 80, 40, 18).fill();
      doc.fillColor("#FCD34D").circle(pageWidth - 50, 90, 14).fill();

      doc.y = 150;
      addTitle(`Nome: ${data.name}`, 20);
      addText(`Data da Análise: ${new Date(data.date).toLocaleDateString("pt-BR")}`, 14);
      addText(`Linguagem Principal: ${data.profileName}`, 16, colors.accent);
      addSeparator();
      doc.moveDown(1.5);
    }

    function addBarChart() {
      checkPageBreak(100);
      addTitle("Distribuição das Linguagens", 16);

      const chartData = data.chartData;
      const chartHeight = 120;
      const chartWidth = contentWidth - 100;
      const barWidth = Math.min(60, chartWidth / chartData.length - 20);
      const startX = margin + 50;
      const startY = doc.y + 20;

      const maxVal = 100;
      const barColors = [colors.accent, "#F59E0B", "#10B981", "#3B82F6", "#EF4444"];

      doc.strokeColor(colors.lightGray).lineWidth(1);
      doc.moveTo(startX - 10, startY).lineTo(startX - 10, startY + chartHeight).stroke();
      doc.moveTo(startX - 10, startY + chartHeight).lineTo(startX + chartWidth, startY + chartHeight).stroke();

      for (let i = 0; i <= 4; i++) {
        const y = startY + (chartHeight / 4) * i;
        doc.strokeColor(colors.secondary).lineWidth(0.5);
        doc.moveTo(startX - 5, y).lineTo(startX + chartWidth, y).stroke();
        setFont(8, false, colors.lightGray);
        doc.text(`${100 - (i * 25)}%`, startX - 35, y - 4);
      }

      chartData.forEach((item, i) => {
        const barHeight = (item.percentage / maxVal) * chartHeight;
        const x = startX + i * (barWidth + 30);
        const y = startY + chartHeight - barHeight;

        doc.fillColor(barColors[i % barColors.length])
           .rect(x, y, barWidth, barHeight)
           .fill();

        setFont(10, true, colors.text);
        doc.text(`${item.percentage}%`, x, y - 15, { width: barWidth, align: "center" });
        setFont(9, false, colors.text);
        doc.text(item.category, x, startY + chartHeight + 10, { width: barWidth, align: "center" });
      });

      doc.y = startY + chartHeight + 50;
    }

    function addCategoryBlocks() {
      data.categories.forEach((cat, index) => {
        checkPageBreak(150);
        doc.rect(margin, doc.y, contentWidth, 30).fill(colors.soft);
        setFont(16, true, colors.primary);
        doc.text(`${cat.name} - ${cat.percentage}%`, margin + 15, doc.y + 8);
        doc.y += 40;
        addText(cat.description, 11);
        setFont(13, true, colors.primary);
        doc.text("COMO DEMONSTRAR:", margin, doc.y);
        doc.moveDown(0.3);
        addList(cat.strengths, colors.text);
        setFont(13, true, colors.accent);
        doc.text("O QUE EVITAR:", margin, doc.y);
        doc.moveDown(0.3);
        addList(cat.challenges, colors.text);
        if (index < data.categories.length - 1) addSeparator();
      });
    }

    function addRecommendations() {
      checkPageBreak(150);
      addTitle("DICAS PERSONALIZADAS", 16);
      data.recommendations.forEach((rec, index) => {
        const cardHeight = 40;
        doc.rect(margin, doc.y, contentWidth, cardHeight).fill("white");
        doc.rect(margin, doc.y, 5, cardHeight).fill(colors.accent);
        doc.strokeColor(colors.lightGray).lineWidth(1);
        doc.rect(margin, doc.y, contentWidth, cardHeight).stroke();
        setFont(11, false, colors.text);
        doc.text(`${index + 1}. ${rec}`, margin + 15, doc.y + 12, {
          width: contentWidth - 25,
          align: "left"
        });
        doc.y += cardHeight + 10;
      });
    }

    function addConclusion() {
      checkPageBreak(100);
      addTitle("REFLEXÕES FINAIS", 16);
      addText(data.conclusion.text, 12);
      doc.rect(margin, doc.y, contentWidth, 25).fill(colors.primary);
      setFont(14, true, "white");
      doc.text("PRÓXIMOS PASSOS", margin + 15, doc.y + 6);
      doc.y += 25;
      addList(data.conclusion.nextSteps, colors.text);
      doc.y = pageHeight - 80;
      addSeparator();
      setFont(10, false, colors.lightGray);
      doc.text("Relatório gerado automaticamente - Linguagens do Amor", margin, doc.y, {
        width: contentWidth,
        align: "center"
      });
    }

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    addCover();
    addBarChart();
    addCategoryBlocks();
    addRecommendations();
    addConclusion();

    doc.end();
  });
}

module.exports = { generateLoveReportPDF };
