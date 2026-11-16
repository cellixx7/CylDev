// Textos das páginas avulsas: privacidade, obrigado e 404.
// Faz parte de src/content/textos/ (ver index.ts). Preços nunca são escritos à mão aqui: saem de servicos.ts e orcamento.ts.
import { site } from "../site";

export const privacidade = {
  titulo: "Política de privacidade",
  atualizado: "Atualizado em 12/11/2026.",
  intro: "Este texto explica, em linguagem simples, o que acontece com os seus dados quando você usa este site. Quem cuida deles é Marcelo Vaz.",
  voltar: "Voltar para o site",
  /** Em `secoes`, `{email}` é trocado por site.email na página. */
  secoes: [
    {
      titulo: "O que eu recebo",
      itens: [
        "Se você enviar um pedido pelo site: o seu nome, o seu WhatsApp, as respostas do orçamento e as observações que escrever.",
        "Se você me chamar pelo WhatsApp: o que você escrever na conversa, junto com o número e o nome do seu perfil.",
        "O site não pede mais nada do que isso, e nada é enviado até você apertar o botão.",
      ],
    },
    {
      titulo: "Para que eu uso",
      itens: ["Só para responder o seu pedido, conversar sobre o orçamento e, se fecharmos, fazer a entrega. Não uso para anúncio nem repasso a ninguém para isso."],
    },
    {
      titulo: "Por onde os dados passam",
      itens: [
        "EmailJS: serviço que entrega o formulário do site no meu e-mail. O envio passa pelos servidores dele, que ficam fora do Brasil.",
        "WhatsApp: se você usar o botão do WhatsApp, a mensagem sai do seu aparelho pelo próprio WhatsApp, que tem a política dele.",
        "Netlify: hospeda o site e pode registrar dados técnicos de acesso, como o endereço IP, conforme a política dela.",
        "As fontes do site ficam no próprio site: nenhuma fonte, estatística ou rastreador de terceiros é carregado.",
      ],
    },
    {
      titulo: "O que fica no seu navegador",
      itens: [
        "O carrinho fica no sessionStorage, só enquanto a aba está aberta, para não se perder ao trocar de página. Ele guarda apenas os serviços escolhidos e as respostas do orçamento; nunca o nome, o telefone nem as observações. É apagado depois de um envio com sucesso.",
        "O tema claro ou escuro que você escolher fica no localStorage.",
        "O site não usa cookies de rastreamento nem ferramentas de análise.",
      ],
    },
    {
      titulo: "Por quanto tempo eu guardo",
      itens: [
        "Os pedidos que chegam no meu e-mail ficam guardados por até 12 meses; depois eu apago.",
        "A conversa no WhatsApp fica no meu aparelho e na minha conta enquanto eu precisar dela para o atendimento e a entrega.",
      ],
    },
    {
      titulo: "Como pedir para apagar ou saber o que tenho",
      itens: [
        "Escreva para {email} pedindo para apagar os seus dados ou para ver o que eu tenho sobre você. Eu respondo e apago o que estiver comigo, inclusive o registro do envio no painel do EmailJS, se houver.",
      ],
    },
  ],
};

export const obrigado = {
  titulo: "Mensagem recebida.",
  texto: "Obrigado pelo contato. Respondo pelo canal que você escolheu.",
  voltar: "Voltar para o site",
};

export const naoEncontrado = {
  titulo: "Essa página não existe.",
  texto: `O link pode estar errado ou a página mudou de lugar. Se precisar de ajuda, escreva para ${site.email}.`,
  voltar: "Ir para o início",
};
