// Termos e condições de contratação (página /termos/). Etapa 5 da auditoria de 16/11/2026.
// Faz parte de src/content/textos/ (ver index.ts). Formato em tipos.ts; links como [rótulo](endereço).
//
// ATENÇÃO: não é parecer jurídico. O texto foi redigido a partir das regras que o site já mostrava
// (50% + 50% por Pix, uma rodada de revisão, hora extra, mensalidade dos bots) e do que a auditoria pediu.
// As cláusulas marcadas PROPOSTA trazem prazos que o Marcelo ainda precisa confirmar (docs/PENDENCIAS.md),
// e o conjunto deve passar pela revisão de um advogado antes de ser tratado como definitivo.
// Ao mudar o texto, troque a data em versoes.ts: ela vai no registro de aceite do e-mail do pedido.
import { mensalidadeBots, VALOR_HORA_EXTRA } from "../orcamento";
import { site } from "../site";
import type { PaginaDeTexto } from "./tipos";
import { versoes } from "./versoes";

const VERSAO = versoes.termos;
const hora = `R$ ${VALOR_HORA_EXTRA}`;
const email = `[${site.email}](mailto:${site.email})`;
const { documento, cidadeUf, comprovante } = site.prestador;

/** PROPOSTA (a confirmar pelo Marcelo): prazos em dias usados nas cláusulas abaixo. */
export const prazosDosTermos = {
  /** Dias depois da entrega para pedir a rodada de revisão incluída. */
  pedirRevisao: 7,
  /** Dias sem resposta do cliente para o projeto poder ser encerrado. */
  semResposta: 30,
  /** Dias para devolver valores por Pix depois do aviso de desistência ou cancelamento. */
  devolucao: 10,
  /** Dias depois da entrega final para apagar as cópias dos arquivos do cliente. */
  apagarArquivos: 30,
  /** Dias úteis para avisar o cliente de um incidente com os dados dele. */
  avisoIncidente: 2,
};
const p = prazosDosTermos;

const documentoLinha = documento
  ? `${documento.tipo}: ${documento.numero}${documento.numero.includes("*") ? " (parcial, para proteger os meus dados). O número completo vai na proposta por escrito, antes de qualquer pagamento" : ""}.`
  : "CPF ou CNPJ: informado na proposta por escrito, antes de qualquer pagamento.";

const comprovanteTexto =
  comprovante === "nota" ? "Depois de cada pagamento eu emito a nota fiscal de serviço." : "Depois de cada pagamento eu emito um recibo.";

const foroDemais = cidadeUf ? `o foro de ${cidadeUf}` : "o foro do domicílio do prestador";

export const termos: PaginaDeTexto = {
  titulo: "Termos de contratação",
  versao: VERSAO,
  atualizado: `Versão de ${VERSAO}.`,
  intro: [
    "Estas são as regras que valem quando você contrata um serviço meu: como o pedido vira contrato, como é o pagamento, o que está incluído, o que acontece se alguém desistir e como eu cuido dos dados que você me passa.",
    "O texto é em linguagem simples, de propósito. Se alguma parte não ficar clara, pergunte antes de contratar.",
  ],
  numerada: true,
  secoes: [
    {
      id: "prestador",
      titulo: "Quem presta o serviço",
      itens: [
        `Nome: ${site.nomeCompleto}.`,
        documentoLinha,
        ...(cidadeUf ? [`Local: ${cidadeUf}. O atendimento é feito pela internet.`] : ["O atendimento é feito pela internet."]),
        `E-mail: ${email}.`,
        `WhatsApp: [abrir a conversa](https://wa.me/${site.whatsapp}).`,
      ],
    },
    {
      id: "site",
      titulo: "O que este site faz",
      texto: [
        "O site mostra os serviços e calcula uma estimativa de valor e de prazo a partir das suas respostas. Essa estimativa não é o preço final.",
        "Enviar um pedido pelo site ou pelo WhatsApp ainda não é contrato e não obriga você a nada. O valor final, o que entra no serviço e a data de entrega vão na proposta por escrito.",
      ],
    },
    {
      id: "contratacao",
      titulo: "Como a contratação acontece",
      itens: [
        "Conversa: você me conta o que precisa, pelo WhatsApp ou pelo Google Meet.",
        "Proposta: eu mando por escrito o que entra no serviço, o que eu preciso receber de você, o valor e a data de entrega.",
        "Aceite: o contrato começa quando você responde por escrito que aceita a proposta (por WhatsApp ou e-mail) e paga a entrada.",
        "Se a proposta disser algo diferente destes Termos, vale a proposta, porque ela foi combinada para o seu caso.",
      ],
    },
    {
      id: "pagamento",
      titulo: "Pagamento",
      itens: [
        "O pagamento é por Pix, em duas partes: 50% de entrada, e eu começo o trabalho depois dela; e 50% antes de eu liberar os arquivos finais ou publicar no seu endereço.",
        comprovanteTexto,
        `Trabalho fora do que está na proposta custa ${hora} por hora. Eu só faço esse trabalho extra depois de avisar o valor e de você concordar por escrito.`,
        "Hospedagem, licenças de programas e uso de inteligência artificial, quando o serviço precisar, são contratados na sua conta e pagos por você direto ao fornecedor. A proposta diz quando isso se aplica.",
      ],
    },
    {
      id: "prazos",
      titulo: "Prazos",
      itens: [
        "A data de entrega vai na proposta. O prazo começa a contar quando a entrada é paga e eu recebo o material combinado (planilhas, textos, acessos).",
        "Se o material atrasar, ou se eu ficar esperando uma resposta sua para continuar, o prazo fica suspenso e a data de entrega anda pelo mesmo número de dias.",
        "Se o atraso for meu, eu aviso antes da data e combino a nova data com você.",
        `Se eu ficar ${p.semResposta} dias sem resposta sua, posso encerrar o serviço. Nesse caso vale a regra de [cancelamento](#cancelamento): você paga só o que já foi feito.`,
      ],
    },
    {
      id: "revisoes",
      titulo: "Revisões e ajustes",
      itens: [
        "A entrega é feita por etapas: você vê o andamento antes do fim e pode corrigir o rumo.",
        `Uma rodada de revisão está incluída no preço. Ela serve para ajustar o que foi entregue dentro do que estava na proposta. Mande os ajustes de uma vez, em até ${p.pedirRevisao} dias depois da entrega.`,
        `Não entra na revisão: pedir algo que não estava na proposta, mudar de ideia sobre o que foi combinado ou pedir novas rodadas. Isso é trabalho extra, a ${hora} por hora, sempre com o valor avisado antes.`,
        "Corrigir defeito não é revisão e não tem custo: veja a [garantia](#garantia).",
      ],
    },
    {
      id: "arrependimento",
      titulo: "Desistência em 7 dias",
      texto: [
        "Se você contrata como consumidor (pessoa física ou negócio que usa o serviço para si), pode desistir em até 7 dias corridos a contar do aceite da proposta, sem precisar explicar o motivo. É o direito de arrependimento do Código de Defesa do Consumidor (art. 49), que vale para contratação feita pela internet ou pelo WhatsApp.",
      ],
      itens: [
        `Para desistir, basta avisar por escrito, pelo WhatsApp ou por ${email}.`,
        `Eu devolvo o valor pago, por Pix, em até ${p.devolucao} dias.`,
        "Eu começo o trabalho logo depois da entrada. Se, dentro dos 7 dias, eu já tiver entregado alguma etapa a seu pedido e você quiser ficar com ela, combinamos por escrito o valor dessa parte. Se não quiser, a devolução é integral e a etapa entregue deixa de poder ser usada.",
      ],
    },
    {
      id: "cancelamento",
      titulo: "Cancelamento depois dos 7 dias",
      itens: [
        "Você pode cancelar a qualquer momento, avisando por escrito.",
        "No cancelamento, você paga só o que já foi feito até o aviso, na proporção do serviço contratado. Eu mostro o que foi feito e entrego essa parte.",
        `Se a entrada for maior do que o trabalho já feito, eu devolvo a diferença por Pix em até ${p.devolucao} dias. Se for menor, a diferença é paga antes de eu entregar a parte pronta.`,
        "Eu posso cancelar se o material ou o pagamento combinado não chegar, ou se o pedido envolver algo ilegal. Nesses casos vale a mesma conta: fica pago só o que foi feito.",
        "Se eu não conseguir entregar por um motivo meu, devolvo tudo o que você pagou pela parte não entregue.",
      ],
    },
    {
      id: "garantia",
      titulo: "Garantia",
      itens: [
        "Você tem 90 dias, a contar da entrega final, para apontar defeitos: algo que não funciona como a proposta descreveu. Eu corrijo sem custo. É a garantia legal do Código de Defesa do Consumidor (art. 26).",
        "A diferença para a revisão: revisão é ajuste de preferência (uma rodada incluída); garantia é conserto do que saiu com defeito (sem limite de rodadas dentro do prazo).",
        "A garantia cobre o que eu entreguei, do jeito que entreguei. Se o arquivo ou o código for alterado depois por você ou por outra pessoa, eu avalio o caso e aviso se o conserto entra na garantia ou se é trabalho extra.",
      ],
    },
    {
      id: "propriedade",
      titulo: "De quem é o que eu entrego",
      itens: [
        "Depois do pagamento integral, o que foi feito para você (planilha, painel, script, página, código do sistema) é seu: você pode usar, alterar e copiar à vontade, sem pagar mais nada por isso.",
        "Antes do pagamento integral, o material entregue por etapas serve só para você avaliar o andamento.",
        "Eu continuo podendo usar em outros trabalhos o conhecimento, as técnicas e os trechos genéricos que não contêm dados nem informações do seu negócio.",
        "Programas e bibliotecas de terceiros usados no serviço (Excel, Power BI, bibliotecas de código aberto) continuam com a licença de quem os fez.",
      ],
    },
    {
      id: "portfolio",
      titulo: "Uso no portfólio",
      itens: [
        "Eu só mostro o seu trabalho ou cito o seu nome como cliente com a sua autorização por escrito.",
        "Mesmo com autorização, nunca mostro dados reais seus, dos seus clientes ou dos seus funcionários: os exemplos usam dados fictícios.",
      ],
    },
    {
      id: "dados",
      titulo: "Dados que você me passa",
      texto: [
        "Para arrumar uma planilha ou montar um painel, eu posso receber dados pessoais dos seus clientes e funcionários. Pela Lei Geral de Proteção de Dados (LGPD), nesses dados você é o controlador e eu sou o operador (art. 39): eu trato os dados em seu nome, seguindo o que combinamos.",
      ],
      itens: [
        "Finalidade: uso os dados só para fazer o serviço contratado. Não uso para mais nada.",
        "Só o necessário: mande apenas o que o serviço precisa. Quando der, troque nomes, CPF e telefones por códigos, ou mande uma amostra. Veja [como enviar os arquivos com segurança](/perguntas/#arquivos).",
        "Sigilo: não mostro, não vendo e não repasso os dados a ninguém. Se o serviço precisar de alguma ferramenta de terceiros que receba os dados, eu aviso antes e só uso com o seu ok.",
        "Segurança: guardo os arquivos em equipamento e em contas com acesso só meu, protegidos por senha.",
        `Exclusão: em até ${p.apagarArquivos} dias depois da entrega final eu apago as cópias dos seus arquivos de dados, a não ser que você peça por escrito para eu guardar durante a garantia ou para um serviço seguinte. O que foi entregue a você continua com você.`,
        `Incidente: se eu souber de perda, vazamento ou acesso indevido aos dados que você me passou, aviso você o quanto antes, em até ${p.avisoIncidente} dias úteis, com o que aconteceu e o que foi feito.`,
        "Pedidos de titulares: se um cliente ou funcionário seu me procurar sobre os dados dele, eu encaminho o pedido a você.",
        "A sua parte: ao me enviar os dados, você confirma que tem o direito de compartilhá-los comigo para esse serviço.",
        "Os dados que você mesmo deixa no site (nome, WhatsApp, respostas do orçamento) seguem a [Política de privacidade](/privacidade/).",
      ],
    },
    {
      id: "sigilo",
      titulo: "Sigilo",
      texto: [
        "Tudo o que eu ficar sabendo sobre o seu negócio durante o serviço (números, preços, clientes, fornecedores, modo de trabalhar) fica em sigilo, durante e depois do serviço. A exceção é o que já for público ou o que a lei ou uma ordem judicial me obrigar a informar.",
      ],
    },
    {
      id: "bots",
      titulo: "Bots de Discord e mensalidade",
      itens: [
        `Os bots têm, além do preço de criação, uma mensalidade de ${mensalidadeBots.fracaoDaCriacao * 100}% do preço de criação por mês. Ela cobre o monitoramento e a correção de erros.`,
        "A hospedagem, onde o bot fica ligado, é um custo à parte. O uso de inteligência artificial, quando houver, é cobrado pelo provedor na sua conta.",
        `Funcionalidade nova depois da entrega custa ${hora} por hora.`,
        "Você pode cancelar a mensalidade a qualquer momento, avisando por escrito, sem multa. O cancelamento vale a partir do fim do mês já pago. Depois disso eu deixo de monitorar e de corrigir o bot.",
        `As condições do plano de ${mensalidadeBots.mesesPlanoAdiantado} meses pago adiantado, quando houver, vão na proposta.`,
      ],
    },
    {
      id: "responsabilidade",
      titulo: "Limites de responsabilidade",
      texto: ["Eu respondo pelo que eu faço. Não tenho como responder por:"],
      itens: [
        "dado errado, incompleto ou desatualizado que você me mandou: o painel e a planilha mostram o que está nos seus dados;",
        "decisões de negócio tomadas a partir dos números: confira antes de decidir algo importante;",
        "serviços de terceiros que saírem do ar ou mudarem as regras (hospedagem, Discord, Microsoft, provedores de IA);",
        "uso do que foi entregue de um jeito diferente do combinado, ou alterações feitas por outra pessoa.",
      ],
      depois: [
        "Quando o contratante não é consumidor (contratação entre empresas, para revenda ou como insumo), a minha responsabilidade fica limitada ao valor pago pelo serviço.",
        "Nada nestes Termos tira ou diminui direito que o Código de Defesa do Consumidor garante a você.",
      ],
    },
    {
      id: "alteracoes",
      titulo: "Mudanças nestes Termos",
      texto: [
        "Eu posso atualizar estes Termos. A data da versão fica no topo da página. Para cada serviço vale a versão que estava publicada no dia em que você aceitou a proposta; mudança posterior não altera o que já foi combinado.",
      ],
    },
    {
      id: "foro",
      titulo: "Lei e foro",
      itens: [
        "Estes Termos seguem a lei brasileira.",
        "Antes de qualquer coisa, fale comigo: a maioria dos problemas se resolve na conversa.",
        `Se for preciso ir à Justiça, o consumidor pode usar o foro da cidade onde mora. Nos demais casos, fica escolhido ${foroDemais}.`,
      ],
    },
    {
      id: "contato",
      titulo: "Contato",
      texto: [`Dúvidas sobre estes Termos: ${email} ou o [WhatsApp da página de contato](/#contato). Veja também as [perguntas frequentes](/perguntas/).`],
    },
  ],
};
