/* =========================================================
   JMS Refrigeração e Gelo — DADOS DO NEGÓCIO
   ---------------------------------------------------------
   ESTE É O ÚNICO ARQUIVO QUE PRECISA SER EDITADO PARA O SITE
   ENTRAR NO AR COM OS DADOS REAIS.

   Tudo daqui é aplicado em tempo de carregamento: links de
   WhatsApp, telefone, e-mail, cidade, horário, rodapé e o
   bloco de dados estruturados (SEO/Google).
   ========================================================= */

window.JMS = {

  /* --- CONTATO --------------------------------------------------------- */

  // Número do WhatsApp SÓ COM DÍGITOS, no formato DDI + DDD + número.
  // Ex.: (83) 99999-1234  ->  "5583999991234"
  whatsapp: "5500000000000",

  // Como o número aparece escrito na tela.
  whatsappExibicao: "(00) 00000-0000",

  // Telefone fixo/alternativo (só dígitos, com DDD). Deixe "" para ocultar.
  telefone: "0000000000",
  telefoneExibicao: "(00) 0000-0000",

  email: "contato@exemplo.com.br",

  // URL completa do Instagram. Deixe "" para esconder o ícone.
  instagram: "",

  /* --- LOCALIZAÇÃO ----------------------------------------------------- */

  cidade: "Sua Cidade",
  uf: "UF",
  endereco: "Sua Cidade / UF e região",
  horario: "Seg a Sáb, 7h às 18h",

  // Aparece no rodapé, depois do "todos os direitos reservados".
  // Ex.: "CNPJ 00.000.000/0001-00"
  cnpj: "",

  /* --- SITE ------------------------------------------------------------ */

  // Domínio final, sem barra no fim. Usado no SEO.
  site: "https://jms-refrigeracao.desbravando-utv.workers.dev",

  /* --- DEPOIMENTOS ------------------------------------------------------
     A seção de depoimentos fica ESCONDIDA enquanto esta lista estiver
     vazia — melhor nenhum depoimento do que um inventado.
     Ao receber avaliações reais, adicione assim:

       { texto: "...", nome: "Nome do cliente", cargo: "Bar do Zé", nota: 5 }
     --------------------------------------------------------------------- */
  depoimentos: []
};
