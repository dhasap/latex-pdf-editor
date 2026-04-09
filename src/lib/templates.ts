export interface Template {
  id: string;
  name: string;
  description: string;
  code: string;
}

export const templates: Template[] = [
  {
    id: "article",
    name: "Basic Article",
    description: "Simple article template for general documents",
    code: `\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage{hyperref}

\\title{Document Title}
\\author{Your Name}
\\date{\\today}

\\begin{document}
\\maketitle

\\section{Introduction}
This is the introduction section. Write your content here.

\\section{Main Content}
Your main content goes here. You can write paragraphs, add equations like $E = mc^2$, and more.

\\subsection{Subsection}
This is a subsection with more details.

\\section{Conclusion}
Conclude your document here.

\\end{document}`,
  },
  {
    id: "resume",
    name: "Modern Resume",
    description: "Professional resume/CV template",
    code: `\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}

\\titleformat{\\section}{\\large\\bfseries}{\\thesection}{1em}{}[\\titlerule]

\\begin{document}
\\begin{center}
  {\\LARGE\\bfseries Your Name}\\[0.5em]
  {\\large your.email@example.com | +1234567890 | City, Country}\\[0.5em]
  {\\small linkedin.com/in/yourprofile | github.com/yourusername}
\\end{center}

\\section{Summary}
Brief summary of your professional background and key skills.

\\section{Experience}
\\textbf{Job Title} \\hfill Month Year -- Present\\
\\textit{Company Name, City}
\\begin{itemize}[leftmargin=*]
  \\item Achievement 1 with quantifiable results
  \\item Achievement 2 with quantifiable results
  \\item Achievement 3 with quantifiable results
\\end{itemize}

\\section{Education}
\\textbf{Degree Name} \\hfill Year\\
\\textit{University Name, City}

\\section{Skills}
\\textbf{Technical:} Skill 1, Skill 2, Skill 3, Skill 4\\
\\textbf{Languages:} Language 1, Language 2

\\end{document}`,
  },
  {
    id: "letter",
    name: "Formal Letter",
    description: "Professional letter template",
    code: `\\documentclass{letter}
\\usepackage[margin=1in]{geometry}

\\address{Your Name\\\\
Your Address\\\\
City, Country\\\\
Email: your.email@example.com}

\\signature{Your Name}

\\begin{document}
\\begin{letter}{Recipient Name\\\\
Company Name\\\\
Address Line 1\\\\
City, Country}

\\opening{Dear Sir/Madam,}

I am writing to express my interest in... [Your letter content here]

[Second paragraph with more details]

[Third paragraph with concluding remarks]

\\closing{Sincerely,}

\\end{letter}
\\end{document}`,
  },
  {
    id: "beamer",
    name: "Beamer Presentation",
    description: "Slide presentation template",
    code: `\\documentclass{beamer}
\\usetheme{Madrid}
\\usecolortheme{default}

\\title{Presentation Title}
\\subtitle{Optional Subtitle}
\\author{Your Name}
\\institute{Your Institution}
\\date{\\today}

\\begin{document}

\\begin{frame}
\\titlepage
\\end{frame}

\\begin{frame}{Outline}
\\tableofcontents
\\end{frame}

\\section{Introduction}
\\begin{frame}{Introduction}
\\begin{itemize}
  \\item Point 1
  \\item Point 2
  \\item Point 3
\\end{itemize}
\\end{frame}

\\section{Main Content}
\\begin{frame}{Key Concepts}
\\begin{block}{Block Title}
Important information here
\\end{block}
\\begin{alertblock}{Alert}
Something to pay attention to
\\end{alertblock}
\\end{frame}

\\section{Conclusion}
\\begin{frame}{Summary}
\\begin{enumerate}
  \\item First key takeaway
  \\item Second key takeaway
  \\item Third key takeaway
\\end{enumerate}
\\end{frame}

\\begin{frame}
\\centering
\\Huge Thank You!
\\vspace{1em}
\\normalsize Questions?
\\end{frame}

\\end{document}`,
  },
  {
    id: "math",
    name: "Math Document",
    description: "Template with math equations and theorems",
    code: `\\documentclass[12pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath, amssymb, amsthm}
\\usepackage{geometry}
\\geometry{margin=1in}

\\theoremstyle{plain}
\\newtheorem{theorem}{Theorem}[section]
\\newtheorem{lemma}[theorem]{Lemma}
\\newtheorem{proposition}[theorem]{Proposition}

\\theoremstyle{definition}
\\newtheorem{definition}[theorem]{Definition}
\\newtheorem{example}[theorem]{Example}

\\title{Mathematical Notes}
\\author{Your Name}
\\date{\\today}

\\begin{document}
\\maketitle

\\section{Introduction}
This document demonstrates mathematical typesetting in LaTeX.

\\section{Key Equations}
The quadratic formula is given by:
\\begin{equation}
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
\\end{equation}

\\section{Theorems}
\\begin{theorem}[Pythagorean Theorem]
In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides:
\\[a^2 + b^2 = c^2\\]
\\end{theorem}

\\begin{proof}
The proof follows from geometric considerations.
\\end{proof}

\\section{Conclusion}
Mathematical expressions like $E = mc^2$ can be typeset inline or as displayed equations.

\\end{document}`,
  },
];

export const defaultCode = templates[0].code;
