// Leitor de CSV pequeno (RFC 4180 enxuto): aspas, vírgula e quebra de linha dentro de aspas, BOM e linhas vazias.
// Lógica pura, sem dependências.

/**
 * Converte o texto de um CSV em linhas de células. Aspas duplas dentro de um campo entre aspas vêm duplicadas ("").
 * Linhas totalmente vazias (sem nenhuma célula preenchida) só são descartadas com `descartarVazias`; a grade da
 * planilha bagunçada as mantém, porque fazem parte da bagunça.
 */
export function lerCsv(texto: string, opcoes: { descartarVazias?: boolean } = {}): string[][] {
  const fonte = texto.charCodeAt(0) === 0xfeff ? texto.slice(1) : texto;
  const linhas: string[][] = [];
  let linha: string[] = [];
  let campo = "";
  let entreAspas = false;
  let temConteudo = false; // a linha atual já recebeu algum caractere ou separador

  const fecharCampo = () => {
    linha.push(campo);
    campo = "";
  };
  const fecharLinha = () => {
    if (temConteudo || campo !== "" || linha.length > 0) {
      fecharCampo();
      linhas.push(linha);
    }
    linha = [];
    temConteudo = false;
  };

  for (let i = 0; i < fonte.length; i++) {
    const c = fonte[i];
    if (entreAspas) {
      if (c === '"') {
        if (fonte[i + 1] === '"') {
          campo += '"';
          i++;
        } else {
          entreAspas = false;
        }
      } else {
        campo += c;
      }
      continue;
    }
    if (c === '"') {
      entreAspas = true;
      temConteudo = true;
    } else if (c === ",") {
      fecharCampo();
      temConteudo = true;
    } else if (c === "\r") {
      if (fonte[i + 1] === "\n") i++;
      fecharLinha();
    } else if (c === "\n") {
      fecharLinha();
    } else {
      campo += c;
      temConteudo = true;
    }
  }
  fecharLinha();

  return opcoes.descartarVazias ? linhas.filter((l) => l.some((c) => c.trim() !== "")) : linhas;
}
