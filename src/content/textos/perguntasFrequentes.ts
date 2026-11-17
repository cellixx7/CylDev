// Perguntas frequentes (página /perguntas/). Etapa 5 da auditoria de 16/11/2026.
// Faz parte de src/content/textos/ (ver index.ts). Formato em tipos.ts; links como [rótulo](endereço).
// (src/content/perguntas.ts é outra coisa: as perguntas do orçamento.)
//
// Regra de honestidade: cada resposta repete o que já está em servicos.ts, nos textos do site ou nos Termos.
// As respostas marcadas A CONFIRMAR dependem de como o Marcelo trabalha na prática (docs/PENDENCIAS.md).
import { VALOR_HORA_EXTRA } from "../orcamento";
import { site } from "../site";
import type { PaginaDeTexto } from "./tipos";

const VERSAO = "16/11/2026";
const email = `[${site.email}](mailto:${site.email})`;
const hora = `R$ ${VALOR_HORA_EXTRA}`;

const comprovante =
  site.prestador.comprovante === "nota"
    ? "Sim. Depois de cada pagamento eu emito a nota fiscal de serviço."
    : "Depois de cada pagamento por Pix eu emito um recibo. Se você precisa de nota fiscal, me avise na conversa, antes da proposta.";

export const perguntasFrequentes: PaginaDeTexto = {
  titulo: "Perguntas frequentes",
  versao: VERSAO,
  atualizado: `Atualizado em ${VERSAO}.`,
  intro: [`As dúvidas mais comuns antes de pedir um orçamento. Se a sua não estiver aqui, escreva para ${email} ou chame no [WhatsApp](/#contato).`],
  secoes: [
    {
      id: "antes",
      titulo: "Antes de contratar",
      blocos: [
        {
          titulo: "O valor que o site mostra é o valor final?",
          texto: ["Não. O site calcula uma estimativa a partir das suas respostas. O valor final vai na proposta por escrito, depois da conversa, e só vale o que estiver nela."],
        },
        {
          titulo: "Enviar o pedido já me compromete?",
          texto: ["Não. O pedido só abre a conversa. O contrato começa quando você aceita a proposta por escrito e paga a entrada. Está nos [Termos de contratação](/termos/#contratacao)."],
        },
        {
          titulo: "Como é o pagamento?",
          texto: ["Por Pix, em duas partes: 50% de entrada, e eu começo depois dela; e 50% antes de eu liberar os arquivos finais ou publicar no seu endereço. Os detalhes estão em [Pagamento](/termos/#pagamento)."],
        },
        {
          titulo: "Você emite nota fiscal?",
          texto: [comprovante],
        },
        {
          titulo: "Quanto tempo leva?",
          texto: ["O orçamento do site já mostra uma estimativa de prazo para a maioria dos serviços. A data de entrega vai na proposta e conta a partir da entrada e do recebimento do seu material."],
        },
        {
          titulo: "E se eu não gostar ou mudar de ideia?",
          texto: [
            "A entrega é por etapas, então você vê o andamento antes do fim e pode corrigir o rumo. Uma rodada de revisão já está incluída no preço.",
            "Quem contrata como consumidor pode desistir em até 7 dias depois do aceite, com devolução do valor. Depois disso, dá para cancelar pagando só o que já foi feito. Veja [Desistência](/termos/#arrependimento) e [Cancelamento](/termos/#cancelamento).",
          ],
        },
      ],
    },
    {
      id: "servico",
      titulo: "Sobre o serviço",
      blocos: [
        {
          titulo: "Preciso ter algum programa pago?",
          texto: [
            "Depende do serviço. O painel é entregue em Excel (o padrão) ou em Power BI Desktop. Compartilhar um painel do Power BI online com a equipe exige licença paga do Power BI do seu lado; no Excel isso não é preciso.",
            "Me diga na conversa qual programa você usa hoje, e eu explico as opções antes da proposta.",
          ],
        },
        {
          titulo: "Você precisa acessar o meu computador?",
          texto: ["Não. Eu trabalho nos arquivos que você me envia. Na conversa pelo Google Meet você pode compartilhar a tela para me mostrar a planilha, e quem controla o seu computador é sempre você."],
        },
        {
          titulo: "Não sei qual serviço escolher. E agora?",
          texto: ["Na parte de [orçamento](/#orcamento) há um guia com poucas perguntas que indica o serviço. Se preferir, conte o problema pelo WhatsApp e eu digo o que serve."],
        },
      ],
    },
    {
      id: "arquivos",
      titulo: "Seus arquivos e dados",
      blocos: [
        {
          titulo: "Como mando a minha planilha com segurança?",
          texto: [
            "Mande só o que o serviço precisa. Se a planilha tiver nomes, CPF ou telefones de clientes e funcionários e isso não for necessário para o trabalho, troque por códigos ou apague essas colunas antes de enviar. Uma amostra com poucas linhas costuma bastar para eu montar a estrutura.",
            "Prefira um link do Google Drive ou do OneDrive compartilhado só com o meu e-mail, e não um link aberto a qualquer pessoa. Depois da entrega, tire o meu acesso.",
            "Não mande senhas de banco nem de sistemas por mensagem.",
          ],
        },
        {
          titulo: "O que você faz com os dados dos meus clientes?",
          texto: ["Uso só para fazer o serviço, guardo em sigilo, não repasso a ninguém e apago as cópias depois da entrega. Se acontecer algum incidente, eu aviso você. Está escrito em [Dados que você me passa](/termos/#dados)."],
        },
        {
          titulo: "O site guarda os meus dados ou usa cookies?",
          texto: ["O site não usa cookies de rastreamento nem ferramentas de análise. Ele só envia o seu nome, o WhatsApp e as respostas do orçamento quando você aperta o botão de enviar. Tudo está na [Política de privacidade](/privacidade/)."],
        },
      ],
    },
    {
      id: "depois",
      titulo: "Depois da entrega",
      blocos: [
        {
          titulo: "E se aparecer um defeito?",
          texto: ["Você tem 90 dias depois da entrega final para apontar o que não funciona como a proposta descreveu, e eu corrijo sem custo. Veja [Garantia](/termos/#garantia)."],
        },
        {
          titulo: "E se eu quiser uma mudança ou algo novo?",
          texto: [`Ajuste fora do que estava na proposta custa ${hora} por hora, sempre com o valor avisado antes de eu começar.`],
        },
        {
          titulo: "O arquivo é meu?",
          texto: ["Sim. Depois do pagamento integral, a planilha, o painel, o script ou a página são seus, para usar e alterar à vontade. Veja [De quem é o que eu entrego](/termos/#propriedade)."],
        },
        {
          titulo: "Você mostra o meu trabalho para outros clientes?",
          texto: ["Só com a sua autorização por escrito, e nunca com dados reais."],
        },
      ],
    },
  ],
};
