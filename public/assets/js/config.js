/* =========================================================
   JMS Refrigeração e Gelo — DADOS DO NEGÓCIO
   ---------------------------------------------------------
   Este é o arquivo que se edita no dia a dia. Tudo daqui é
   aplicado no carregamento: os links de WhatsApp, o telefone,
   o e-mail, a lista de cidades, o rodapé e parte do bloco de
   dados estruturados que o Google lê.

   ATENÇÃO: a cidade também aparece no <title>, na meta
   description e no canonical do index.html — esses o Google
   precisa ler no HTML, então não dá para gerá-los por JS.
   Se mudar de cidade, mude nos dois lugares.
   ========================================================= */

window.JMS = {

  /* --- CONTATO --------------------------------------------------------- */

  // WhatsApp SÓ COM DÍGITOS: DDI + DDD + número.
  whatsapp: "5583993008384",

  // Como o número aparece escrito na tela.
  whatsappExibicao: "(83) 99300-8384",

  // Mensagem que abre a conversa quando o botão não tem uma própria.
  mensagemPadrao: "Olá! Vim pelo site da JMS Refrigeração e Gelo e gostaria de um orçamento.",

  // true  = cada botão manda uma mensagem própria ("quero gelo em escama",
  //         "meu equipamento parou"), e a JMS já sabe do que se trata.
  // false = TODOS os botões mandam exatamente a mensagemPadrao acima.
  mensagemPorBotao: true,

  // Telefone fixo OPCIONAL, só com dígitos e DDD. Vazio = a linha some do site.
  // Os botões de ação são todos WhatsApp; isto aqui é só um canal alternativo.
  telefone: "",
  telefoneExibicao: "",

  // Vazio = a linha de e-mail some do site e sai dos dados estruturados.
  email: "",

  // URL completa do Instagram. Vazio = o ícone some.
  instagram: "",

  /* --- LOCALIZAÇÃO ----------------------------------------------------- */

  cidade: "João Pessoa",
  uf: "PB",
  endereco: "João Pessoa, Bayeux e região — PB",

  // Vazio = a linha de horário some da página.
  // Ao preencher, avise também o horário nos dados estruturados: o bloco
  // "openingHoursSpecification" foi retirado do index.html para o site não
  // declarar ao Google um horário que ninguém confirmou.
  horario: "",

  /* ⚠️ CONFIRME ESTA LISTA. Ela afirma publicamente onde a JMS atende e
     alimenta a seção "Onde atendemos" e os dados estruturados. Estão aqui
     os municípios da Grande João Pessoa; tire o que não atender e
     acrescente o que faltar. */
  cidades: [
    "João Pessoa",
    "Bayeux",
    "Santa Rita",
    "Cabedelo",
    "Conde"
  ],

  // Aparece no rodapé, depois do "todos os direitos reservados".
  // Ex.: "CNPJ 00.000.000/0001-00"
  cnpj: "",

  /* --- SITE ------------------------------------------------------------ */

  // Domínio final, sem barra no fim. Usado no SEO.
  site: "https://jms-refrigeracao.ryzecode.workers.dev",

  /* --- DEPOIMENTOS ------------------------------------------------------
     A seção fica ESCONDIDA enquanto esta lista estiver vazia — melhor
     nenhum depoimento do que um inventado. Com avaliações reais:

       { texto: "...", nome: "Nome do cliente", cargo: "Bar do Zé", nota: 5 }
     --------------------------------------------------------------------- */
  depoimentos: []
};
