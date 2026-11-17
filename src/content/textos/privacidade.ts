// Política de privacidade (página /privacidade/).
// Faz parte de src/content/textos/, mas é importada direto pela página (ver a nota no index.ts).
import { site } from "../site";
import type { PaginaDeTexto } from "./tipos";
import { versoes } from "./versoes";

const VERSAO_PRIVACIDADE = versoes.privacidade;
const email = `[${site.email}](mailto:${site.email})`;

/** Prazos prometidos na política. São promessas a cumprir: mudar aqui muda o que o site promete. */
export const prazosDaPrivacidade = {
  /** Meses de guarda dos pedidos que chegam por e-mail e não viram contrato. */
  guardaPedidos: 12,
  /** Dias para responder a um pedido do titular (LGPD, art. 19). */
  respostaAoTitular: 15,
};

/**
 * Política de privacidade (página /privacidade/). Formato em tipos.ts; links como [rótulo](endereço).
 * Revisada na Etapa 5 da auditoria (16/11/2026) para cobrir a LGPD: bases legais, direitos do art. 18,
 * transferência internacional, ANPD, vigência e alteração. Não é parecer jurídico; vale a revisão de um advogado.
 * Ao mudar o texto, troque a data em versoes.ts.
 */
export const privacidade: PaginaDeTexto = {
  titulo: "Política de privacidade",
  versao: VERSAO_PRIVACIDADE,
  atualizado: `Versão de ${VERSAO_PRIVACIDADE}.`,
  intro: [`Este texto explica, em linguagem simples, o que acontece com os seus dados quando você usa este site. Quem cuida deles é ${site.nome}.`],
  secoes: [
    {
      id: "responsavel",
      titulo: "Quem é o responsável",
      itens: [
        `O responsável pelos dados que você deixa neste site (o controlador, na Lei Geral de Proteção de Dados, a LGPD) é ${site.nome}.`,
        `O canal para qualquer assunto de privacidade é ${email}. Trabalho sozinho e não tenho um encarregado de dados nomeado à parte: quem responde sou eu.`,
      ],
    },
    {
      id: "recebo",
      titulo: "O que eu recebo",
      itens: [
        "Se você enviar um pedido pelo site: o seu nome, o seu WhatsApp, as respostas do orçamento e as observações que escrever.",
        "Se você usar o formulário de contato: o seu nome, o WhatsApp ou o e-mail que escolher para a resposta, e a mensagem.",
        "Se você me chamar pelo WhatsApp: o que você escrever na conversa, junto com o número e o nome do seu perfil.",
        "O site não pede mais nada do que isso, e nada é enviado até você apertar o botão.",
      ],
    },
    {
      id: "uso",
      titulo: "Para que eu uso e com que base na lei",
      texto: ["A LGPD pede que cada uso de dados tenha uma base legal (art. 7º). Aqui são estas:"],
      itens: [
        "Responder o seu pedido e conversar sobre o orçamento: procedimentos preliminares a um contrato, feitos a seu pedido (art. 7º, V).",
        "Fazer e entregar o serviço, se fecharmos: execução do contrato (art. 7º, V).",
        "Guardar a proposta, o aceite e os comprovantes de pagamento: cumprimento de obrigação legal e exercício regular de direitos (art. 7º, II e VI).",
        "Dados técnicos de acesso registrados pela hospedagem, como o endereço IP: legítimo interesse em manter o site seguro e no ar (art. 7º, IX).",
        "Não uso os seus dados para anúncio, não monto perfil e não vendo nem repasso a ninguém para isso.",
      ],
    },
    {
      id: "terceiros",
      titulo: "Por onde os dados passam",
      itens: [
        "EmailJS: serviço que entrega o formulário do site no meu e-mail. O envio passa pelos servidores dele, que ficam fora do Brasil.",
        "WhatsApp: se você usar o botão do WhatsApp, a mensagem sai do seu aparelho pelo próprio WhatsApp, que tem a política dele.",
        "Netlify: hospeda o site e pode registrar dados técnicos de acesso, como o endereço IP, conforme a política dela.",
        "Gmail: é onde os pedidos chegam e ficam guardados.",
        "As fontes do site ficam no próprio site: nenhuma fonte, estatística ou rastreador de terceiros é carregado.",
      ],
    },
    {
      id: "internacional",
      titulo: "Dados fora do Brasil",
      texto: [
        "EmailJS, Netlify, WhatsApp e Gmail guardam ou processam dados em servidores fora do Brasil. Isso é uma transferência internacional de dados, que a LGPD permite nas hipóteses do art. 33. Aqui ela acontece porque é necessária para responder o seu pedido e executar o contrato (art. 33, IX).",
      ],
    },
    {
      id: "navegador",
      titulo: "O que fica no seu navegador",
      itens: [
        "O carrinho fica no sessionStorage, só enquanto a aba está aberta, para não se perder ao trocar de página. Ele guarda apenas os serviços escolhidos e as respostas do orçamento; nunca o nome, o telefone nem as observações. É apagado depois de um envio com sucesso.",
        "O tema claro ou escuro que você escolher fica no localStorage.",
        "O site não usa cookies de rastreamento nem ferramentas de análise. Por isso não há aviso de cookies.",
      ],
    },
    {
      id: "guarda",
      titulo: "Por quanto tempo eu guardo",
      itens: [
        `Os pedidos que chegam no meu e-mail e não viram contrato ficam guardados por até ${prazosDaPrivacidade.guardaPedidos} meses; depois eu apago.`,
        "A conversa no WhatsApp fica no meu aparelho e na minha conta enquanto eu precisar dela para o atendimento e a entrega.",
        "Se fecharmos um serviço, a proposta, o aceite e os comprovantes de pagamento ficam guardados pelo prazo em que a lei exige ou permite comprovar o serviço (em regra, 5 anos).",
      ],
    },
    {
      id: "clientes",
      titulo: "Dados dos seus clientes e funcionários",
      texto: [
        "Se você contratar um serviço e me mandar planilhas com dados de outras pessoas, quem decide sobre esses dados é você, e eu só os uso para fazer o serviço. As regras estão nos [Termos de contratação](/termos/#dados): sigilo, uso só para o serviço, exclusão ao final e aviso em caso de incidente.",
      ],
    },
    {
      id: "direitos",
      titulo: "Os seus direitos",
      texto: ["A LGPD (art. 18) garante que você pode, a qualquer momento e sem custo:"],
      itens: [
        "confirmar se eu tenho dados seus;",
        "acessar os dados que eu tenho;",
        "corrigir dado incompleto, errado ou desatualizado;",
        "pedir a anonimização, o bloqueio ou a eliminação de dado desnecessário, excessivo ou tratado fora da lei;",
        "pedir a portabilidade dos dados;",
        "pedir a eliminação dos dados tratados com o seu consentimento;",
        "saber com quem os dados foram compartilhados;",
        "saber que pode negar um consentimento e o que acontece se negar;",
        "revogar um consentimento que tenha dado.",
      ],
    },
    {
      id: "pedir",
      titulo: "Como pedir para apagar ou saber o que tenho",
      itens: [
        `Escreva para ${email} dizendo o que você quer: ver, corrigir ou apagar os seus dados. Eu respondo em até ${prazosDaPrivacidade.respostaAoTitular} dias e apago o que estiver comigo, inclusive o registro do envio no painel do EmailJS, se houver.`,
        "Só fica guardado o que a lei me obriga a manter, como os comprovantes de um serviço já prestado, e eu aviso quando for o caso.",
        "Se você achar que eu não resolvi, pode reclamar na Autoridade Nacional de Proteção de Dados (ANPD), em [gov.br/anpd](https://www.gov.br/anpd).",
      ],
    },
    {
      id: "alteracoes",
      titulo: "Mudanças nesta política",
      texto: [
        "Se eu mudar o que faço com os dados (por exemplo, se o site passar a usar alguma ferramenta de estatística), este texto muda antes, e a data da versão no topo da página muda junto. A versão publicada aqui é a que vale.",
      ],
    },
  ],
};
