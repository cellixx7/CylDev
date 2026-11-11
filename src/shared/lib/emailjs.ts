import { site } from "../../content/site";

const ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

/** Tempo mínimo entre abrir a página e enviar. Bots costumam enviar na hora. */
export const TEMPO_MINIMO_MS = 3000;

/** Um serviço do pedido, já em texto simples, para o template do e-mail. */
export type ItemEmail = {
  /** Nome do serviço. */
  titulo: string;
  /** Preço no formato do carrinho, com "(estimativa)" quando falta resposta. */
  valor: string;
  /** Uma linha por pergunta: "Pergunta resposta". */
  respostas: string;
};

export type DadosContato = {
  nome: string;
  preferencia: "whatsapp" | "email";
  contato: string;
  assunto: string;
  mensagem: string;
  origem: string;
  /** Dados da calculadora, em texto. Sem calculadora, o envio usa "—". */
  pacote?: string;
  tamanho?: string;
  estimativa?: string;
  /** Pedido do carrinho, um item por serviço. Sem carrinho, vai uma lista vazia. */
  itens?: ItemEmail[];
  /** Total no formato do carrinho. */
  total?: string;
  /** Texto livre do cliente. */
  observacoes?: string;
};

/** Valor enviado quando o pedido não vem da calculadora. */
export const SEM_DADO = "—";

export function emailjsConfigurado(cfg = site.emailjs): boolean {
  return Boolean(cfg.serviceId && cfg.templateId && cfg.publicKey);
}

/** Sinais de spam: isca preenchida ou envio rápido demais. */
export function pareceSpam(isca: string, abertoEm: number, agora = Date.now()): boolean {
  return isca.trim() !== "" || agora - abertoEm < TEMPO_MINIMO_MS;
}

/**
 * Envia pela API REST do EmailJS, sem dependência extra.
 * Os parâmetros precisam ter os mesmos nomes no template do EmailJS.
 */
export async function enviarContato(dados: DadosContato, cfg = site.emailjs): Promise<void> {
  if (!emailjsConfigurado(cfg)) throw new Error("EmailJS sem configuração.");
  const resposta = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: cfg.serviceId,
      template_id: cfg.templateId,
      user_id: cfg.publicKey,
      template_params: {
        nome: dados.nome,
        preferencia: dados.preferencia === "whatsapp" ? "WhatsApp" : "E-mail",
        contato: dados.contato,
        assunto: dados.assunto || "Contato pelo site",
        mensagem: dados.mensagem,
        origem: dados.origem,
        pacote: dados.pacote || SEM_DADO,
        tamanho: dados.tamanho || SEM_DADO,
        estimativa: dados.estimativa || SEM_DADO,
        // Texto simples: o template do EmailJS é que decide a aparência (ver docs/emailjs-template.md).
        itens: (dados.itens ?? []).map((i) => ({
          titulo: i.titulo || SEM_DADO,
          valor: i.valor || SEM_DADO,
          respostas: i.respostas || SEM_DADO,
        })),
        total: dados.total || SEM_DADO,
        observacoes: dados.observacoes || SEM_DADO,
      },
    }),
  });
  if (!resposta.ok) throw new Error(`EmailJS respondeu ${resposta.status}.`);
}
