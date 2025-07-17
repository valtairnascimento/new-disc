const PDFDocument = require("pdfkit");

function generateDiscReportPDF(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers = [];

    const colors = {
      primary: "#192E54",
      secondary: "#F0F2F7",
      accent: "#3B82F6",
      text: "#1F2937",
      lightGray: "#9CA3AF",
      success: "#22C55E",
      warning: "#FBBF24",
      danger: "#EF4444"
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
      doc.text("Relatório de Perfil DISC", margin, 30, { width: contentWidth, align: "center" });
      setFont(16, false, "white");

      doc.fillColor(colors.accent).circle(pageWidth - 80, 40, 20).fill();
      doc.fillColor(colors.success).circle(pageWidth - 60, 80, 15).fill();
      doc.fillColor(colors.warning).circle(pageWidth - 100, 90, 12).fill();

      doc.y = 150;
      addTitle(`Nome: ${data.name}`, 20);
      addText(`Data da Análise: ${new Date(data.date).toLocaleDateString("pt-BR")}`, 14);
      addText(`Perfil Principal: ${data.profileName}`, 16, colors.accent);
      addSeparator();
      doc.moveDown(2);
    }

    function addBarChart() {
      checkPageBreak(100);
      addTitle("Análise Gráfica dos Perfis", 16);

      const chartData = data.chartData;
      const chartHeight = 120;
      const chartWidth = contentWidth - 100;
      const barWidth = Math.min(60, chartWidth / chartData.length - 20);
      const startX = margin + 50;
      const startY = doc.y + 20;

      const maxVal = 100;
      const barColors = [colors.accent, colors.success, colors.warning, colors.danger];

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

    function addTable() {
      checkPageBreak(150);
      addTitle("Tabela de Pontuacao Detalhada", 16);

      const headers = ["Categoria", "Pontos", "Percentual", "Classificacao"];
      const colWidths = [120, 80, 80, 120];
      const colX = [margin];

      for (let i = 1; i < colWidths.length; i++) {
        colX[i] = colX[i - 1] + colWidths[i - 1];
      }

      const rowHeight = 25;
      const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
      const tableY = doc.y;

      doc.rect(margin, tableY, tableWidth, rowHeight).fill(colors.primary);
      headers.forEach((header, i) => {
        setFont(11, true, "white");
        const textY = tableY + (rowHeight - 11) / 2;
        doc.text(header, colX[i] + 5, textY, { width: colWidths[i] - 10, align: "center" });
      });

      let currentY = tableY + rowHeight;

      data.tableData.forEach((row, idx) => {
        const bgColor = idx % 2 === 0 ? "white" : colors.secondary;
        doc.rect(margin, currentY, tableWidth, rowHeight).fill(bgColor);
        doc.strokeColor(colors.lightGray).lineWidth(0.5);
        doc.rect(margin, currentY, tableWidth, rowHeight).stroke();

        const values = [row.category, row.points, `${row.percentage}%`, row.classification];
        values.forEach((val, i) => {
          setFont(10, false, colors.text);
          const textY = currentY + (rowHeight - 10) / 2;
          doc.text(val.toString(), colX[i] + 5, textY, { width: colWidths[i] - 10, align: "center" });
        });

        currentY += rowHeight;
      });

      doc.y = currentY + 20;
    }

    function addCategoryBlocks() {
      data.categories.forEach((cat, index) => {
        checkPageBreak(150);
        const cardHeight = 30;
        doc.rect(margin, doc.y, contentWidth, cardHeight).fill(colors.secondary);
        setFont(16, true, colors.primary);
        doc.text(`${cat.name} - ${cat.percentage}%`, margin + 15, doc.y + 8);
        doc.y += cardHeight + 10;
        addText(cat.description, 11);
        setFont(13, true, colors.success);
        doc.text("PONTOS FORTES:", margin, doc.y);
        doc.moveDown(0.3);
        addList(cat.strengths, colors.text);
        setFont(13, true, colors.warning);
        doc.text("DESAFIOS:", margin, doc.y);
        doc.moveDown(0.3);
        addList(cat.challenges, colors.text);
        if (index < data.categories.length - 1) addSeparator();
      });
    }

    function addRecommendations() {
      checkPageBreak(150);
      addTitle("RECOMENDACOES PERSONALIZADAS", 16);
      data.recommendations.forEach((recommendation, index) => {
        const cardHeight = 40;
        doc.rect(margin, doc.y, contentWidth, cardHeight).fill("white");
        doc.rect(margin, doc.y, 5, cardHeight).fill(colors.accent);
        doc.strokeColor(colors.lightGray).lineWidth(1);
        doc.rect(margin, doc.y, contentWidth, cardHeight).stroke();
        setFont(11, false, colors.text);
        doc.text(`${index + 1}. ${recommendation}`, margin + 15, doc.y + 12, {
          width: contentWidth - 25,
          align: "left"
        });
        doc.y += cardHeight + 10;
      });
      doc.moveDown(1);
    }

    function addDevelopmentPlan() {
      checkPageBreak(200);
      addTitle("PLANO DE DESENVOLVIMENTO PERSONALIZADO", 16);
      doc.rect(margin, doc.y, contentWidth, 25).fill(colors.success);
      setFont(14, true, "white");
      doc.text("AREAS DE FORCA", margin + 15, doc.y + 6);
      doc.y += 25;
      doc.moveDown(0.5);
      addList(data.developmentPlan.strengths, colors.text);
      doc.rect(margin, doc.y, contentWidth, 25).fill(colors.accent);
      setFont(14, true, "white");
      doc.text("OPORTUNIDADES DE CRESCIMENTO", margin + 15, doc.y + 6);
      doc.y += 25;
      doc.moveDown(0.5);
      addList(data.developmentPlan.growthOpportunities, colors.text);
    }

    function addConclusion() {
      checkPageBreak(150);
      addTitle("CONCLUSAO E PROXIMOS PASSOS", 16);
      addText(data.conclusion.text, 12);
      doc.rect(margin, doc.y, contentWidth, 25).fill(colors.primary);
      setFont(14, true, "white");
      doc.text("PROXIMOS PASSOS", margin + 15, doc.y + 6);
      doc.y += 25;
      doc.moveDown(0.5);
      addList(data.conclusion.nextSteps, colors.text);
      doc.y = pageHeight - 80;
      addSeparator();
      setFont(10, false, colors.lightGray);
      doc.text("Relatório gerado automaticamente - D.I.S.C", margin, doc.y, {
        width: contentWidth,
        align: "center"
      });
    }

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    addCover();
    addBarChart();
    addTable();
    addCategoryBlocks();
    addRecommendations();
    addDevelopmentPlan();
    addConclusion();

    doc.end();
  });
}

module.exports = { generateDiscReportPDF };