const fs = require("fs").promises;
const path = require("path");

exports.generatePDFContent = async (result, profileData) => {
  const { profile, scores, resultId } = result;
  const { description, strengths, weaknesses } = profileData;

  // Escapa caracteres especiais para LaTeX
  const escapeLatex = (str) =>
    str
      .replace(/([&%$#_{}])/g, "\\$1")
      .replace(/\\/g, "\\textbackslash")
      .replace(/[\n\r]/g, " ");

  // Formata listas para LaTeX
  const formatList = (items) =>
    items.map((item) => `\\item ${escapeLatex(item)}`).join("\n");

  // Conteúdo LaTeX
  const latexContent = `
\\documentclass[a4paper,12pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage{geometry}
\\geometry{margin=2cm}
\\usepackage{booktabs}
\\usepackage{enumitem}
\\usepackage{xcolor}

\\title{Relatório de Perfil DISC}
\\author{}
\\date{${new Date().toLocaleDateString("pt-BR")}}

\\begin{document}
\\maketitle

\\section*{Perfil DISC: ${escapeLatex(profile)}}
\\textbf{ID do Resultado:} ${resultId}\\\\
\\textbf{Data:} ${new Date().toLocaleDateString("pt-BR")}

\\section{Descrição do Perfil}
${escapeLatex(description)}

\\section{Pontuações}
\\begin{tabular}{l c}
\\toprule
\\textbf{Traço} & \\textbf{Pontuação (Normalizada)} \\\\
\\midrule
Dominância (D) & ${scores.D.toFixed(2)} \\\\
Influência (I) & ${scores.I.toFixed(2)} \\\\
Estabilidade (S) & ${scores.S.toFixed(2)} \\\\
Conformidade (C) & ${scores.C.toFixed(2)} \\\\
\\bottomrule
\\end{tabular}

\\section{Pontos Fortes}
\\begin{itemize}
${formatList(strengths)}
\\end{itemize}

\\section{Áreas de Melhoria}
\\begin{itemize}
${formatList(weaknesses)}
\\end{itemize}

\\end{document}
`;

  return latexContent;
};
