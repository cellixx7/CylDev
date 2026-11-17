import { describe, expect, it } from "vitest";
import { serializarCarrinho } from "../shared/lib/carrinho-persistencia";
import { estadoInicial } from "../shared/lib/carrinho-estado";
import { textoSemLinks } from "../shared/lib/texto-rico";
import { site } from "./site";
import { versoes, type PaginaDeTexto } from "./textos";
import { acessibilidade } from "./textos/acessibilidade";
import { perguntasFrequentes } from "./textos/perguntasFrequentes";
import { prazosDaPrivacidade, privacidade } from "./textos/privacidade";
import { prazosDosTermos, termos } from "./textos/termos";

describe("política de privacidade", () => {
  const tudo = JSON.stringify(privacidade);

  it("cita os terceiros e o prazo que o site de fato usa", () => {
    for (const termo of ["EmailJS", "WhatsApp", "Netlify", "Gmail", `${prazosDaPrivacidade.guardaPedidos} meses`, "sessionStorage", site.email]) expect(tudo).toContain(termo);
  });

  it("cobre o básico da LGPD: base legal, direitos do art. 18, transferência internacional, ANPD e alteração", () => {
    for (const termo of ["art. 7º", "art. 18", "art. 33", "ANPD", "portabilidade", "anonimização", "revogar", "controlador", `${prazosDaPrivacidade.respostaAoTitular} dias`])
      expect(tudo).toContain(termo);
    for (const id of ["responsavel", "uso", "internacional", "direitos", "pedir", "alteracoes"]) expect(privacidade.secoes.map((s) => s.id)).toContain(id);
    expect(privacidade.atualizado).toContain(privacidade.versao);
    expect(privacidade.versao).toBe(versoes.privacidade);
  });

  it("o carrinho salvo no navegador não leva nome, telefone nem observações (como a política afirma)", () => {
    const salvo = serializarCarrinho({ ...estadoInicial(), ids: ["planilha"] });
    expect(salvo).not.toMatch(/nome|telefone|whatsapp|observa/i);
  });
});

describe("termos de contratação", () => {
  const tudo = JSON.stringify(termos);
  const ids = termos.secoes.map((s) => s.id);

  it("tem as seções que a auditoria pediu, com âncoras estáveis", () => {
    for (const id of ["prestador", "site", "contratacao", "pagamento", "prazos", "revisoes", "arrependimento", "cancelamento", "garantia", "propriedade", "portfolio", "dados", "sigilo", "bots", "responsabilidade", "alteracoes", "foro"])
      expect(ids, id).toContain(id);
  });

  it("a versão é a de versoes.ts, a mesma que vai no registro de aceite do pedido", () => {
    expect(termos.versao).toBe(versoes.termos);
    expect(termos.atualizado).toContain(versoes.termos);
  });

  it("repete as regras que o site já mostrava, sem número escrito à mão", () => {
    for (const termo of ["50% de entrada", "Pix", "Uma rodada de revisão", "R$ 50 por hora", "7 dias corridos", "90 dias", "art. 49", "art. 26", "art. 39", "proposta por escrito", site.nome, site.email])
      expect(tudo, termo).toContain(termo);
  });

  it("os prazos propostos aparecem no texto como estão em prazosDosTermos", () => {
    const p = prazosDosTermos;
    for (const trecho of [`até ${p.pedirRevisao} dias depois da entrega`, `${p.semResposta} dias sem resposta`, `em até ${p.devolucao} dias`, `em até ${p.apagarArquivos} dias depois da entrega final`, `em até ${p.avisoIncidente} dias úteis`])
      expect(tudo, trecho).toContain(trecho);
  });

  it("sem CPF ou CNPJ em site.ts, diz que o documento vai na proposta; com ele, mostra o número", () => {
    const linha = termos.secoes.find((s) => s.id === "prestador")!.itens!.join(" ");
    if (site.prestador.documento) expect(linha).toContain(site.prestador.documento.numero);
    else expect(linha).toContain("informado na proposta por escrito");
  });
});

describe("páginas de leitura", () => {
  const paginas: Record<string, PaginaDeTexto> = { privacidade, termos, acessibilidade, perguntasFrequentes };
  const ancoras = (p: PaginaDeTexto) => new Set(p.secoes.map((s) => s.id));
  const rotas: Record<string, Set<string>> = {
    "/privacidade/": ancoras(privacidade),
    "/termos/": ancoras(termos),
    "/acessibilidade/": ancoras(acessibilidade),
    "/perguntas/": ancoras(perguntasFrequentes),
    "/": new Set(["orcamento", "contato", "entregas", "sobre"]),
  };
  const textosDa = (p: PaginaDeTexto) => [...p.intro, ...p.secoes.flatMap((s) => [...(s.texto ?? []), ...(s.itens ?? []), ...(s.depois ?? []), ...(s.blocos ?? []).flatMap((b) => b.texto)])];

  for (const [nome, pagina] of Object.entries(paginas)) {
    it(`${nome}: ids únicos, seções com conteúdo e nenhuma marcação sobrando`, () => {
      const ids = pagina.secoes.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const s of pagina.secoes) expect((s.texto?.length ?? 0) + (s.itens?.length ?? 0) + (s.blocos?.length ?? 0), s.id).toBeGreaterThan(0);
      const textos = textosDa(pagina);
      expect(new Set(textos).size, "textos repetidos quebrariam as chaves da lista").toBe(textos.length);
      for (const t of textos) expect(textoSemLinks(t), t).not.toMatch(/\]\(|\{|\}|undefined|null|NaN/);
    });

    it(`${nome}: todo link interno aponta para uma página e uma âncora que existem`, () => {
      for (const t of textosDa(pagina)) {
        for (const m of t.matchAll(/\]\((\/[^)]*)\)/g)) {
          const [caminho, ancora] = m[1].split("#");
          expect(Object.keys(rotas), m[1]).toContain(caminho);
          if (ancora) expect([...rotas[caminho]], m[1]).toContain(ancora);
        }
      }
    });
  }
});
