import { site } from "../../content/site";

const ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

/** Tempo mínimo entre abrir a página e enviar. Bots costumam enviar na hora. */
export const TEMPO_MINIMO_MS = 3000;

export type DadosContato = {
  nome: string;
  preferencia: "whatsapp" | "email";
  contato: string;
  assunto: string;
  mensagem: string;
  origem: string;
};

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
      },
    }),
  });
  if (!resposta.ok) throw new Error(`EmailJS respondeu ${resposta.status}.`);
}
