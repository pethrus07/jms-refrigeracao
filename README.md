# JMS Refrigeração e Gelo — site institucional

Site de uma página, estático, com **todos os CTAs indo para o WhatsApp**.
Sem backend, sem banco, sem build: arquivos soltos servidos pelo Cloudflare.

**No ar:** https://jms-refrigeracao.desbravando-utv.workers.dev
**WhatsApp:** (83) 99300-8384 · **Atendimento:** João Pessoa, Bayeux e região

---

## Como o site converte

Não existe formulário que envia e-mail, nem "fale conosco" que cai numa caixa
que ninguém abre. **Os 34 pontos de ação da página abrem o WhatsApp com a
mensagem já escrita**, e o contexto vai junto: quem clica em "Pedir gelo em
escama" chega dizendo isso, e a JMS já sabe do que se trata antes de responder.

Os dois formulários (hero e contato) também não têm servidor: montam a mensagem
com nome, telefone, assunto e detalhe, e entregam a conversa pronta. Nada é
armazenado neste site.

---

## O arquivo que se edita

📄 [`public/assets/js/config.js`](public/assets/js/config.js) — dados do negócio.
Alimenta, no carregamento: todos os links de WhatsApp, o telefone e o e-mail
opcionais, a lista de cidades, o rodapé e o conteúdo dos dados estruturados.

| Campo | O que faz |
|---|---|
| `whatsapp` | `55` + DDD + número, só dígitos. É o destino de **todos** os CTAs. |
| `whatsappExibicao` | como o número aparece escrito na tela |
| `mensagemPadrao` | mensagem usada quando o botão não tem uma própria |
| `mensagemPorBotao` | `true` = cada botão manda a sua · `false` = todos mandam a padrão |
| `telefone` / `email` / `instagram` | **opcionais**: vazios, a linha some da página |
| `cidade` · `uf` · `cidades[]` | região de atendimento e a seção "Onde atendemos" |
| `endereco` · `cnpj` | textos de contato e rodapé |
| `horario` | **vazio hoje**: a linha some da página. Ver nota abaixo. |
| `depoimentos[]` | vazio = a seção de depoimentos fica escondida |

> **A cidade aparece em dois lugares.** No `config.js` (textos da página) e
> direto no `index.html` — `<title>`, `meta description`, `canonical` e `og:`.
> Esses o Google precisa ler no HTML, então não dá para gerá-los por JS.
> Ao mudar de cidade, mude nos dois.

---

## O que ainda precisa da sua confirmação

1. **A lista de cidades** em `config.js` (`cidades[]`) hoje traz os municípios da
   Grande João Pessoa: João Pessoa, Bayeux, Santa Rita, Cabedelo e Conde.
   Isso é uma **afirmação pública de onde a JMS atende** — tire o que não atender.
   A lista alimenta a seção "Onde atendemos" e o `areaServed` dos dados estruturados.
2. **As promessas do texto**: "garantia no serviço", "equipe técnica própria",
   "atendimento de urgência", "prioridade para contrato", "gelo com água tratada".
   São afirmações comerciais padrão do setor — confirme que todas valem.
3. **Nenhum preço** aparece no site, de propósito. Todo pedido de valor vira conversa.
4. **Nenhum depoimento** foi inventado: a seção só existe quando `depoimentos[]`
   tiver avaliação real.
5. **O horário de atendimento saiu do site.** Ele tinha sido escrito por suposição
   ("Seg a Sáb, 7h às 18h") e não estava confirmado. Para trazer de volta: preencha
   `horario` no `config.js` (a linha reaparece no cartão de contato) e reponha o
   bloco `openingHoursSpecification` no `@graph` do `index.html`, com os horários
   reais — é o que o Google mostra como "aberto/fechado agora".

---

## Se uma alteração não aparecer no navegador

Os arquivos são chamados com uma versão na URL: `style.css?v=20260917b`. Ao publicar
uma mudança em CSS ou JS que **precise** aparecer na hora para quem já visitou o site,
troque esse `?v=` nas três linhas do `index.html` (e nas do `404.html`).

O `_headers` já manda o navegador revalidar HTML, CSS e JS a cada visita
(`max-age=0, must-revalidate`) — o `?v=` é a garantia extra para escapar de uma
borda da Cloudflare que ainda tenha a versão anterior guardada. Fontes e imagens
continuam com cache longo, porque não mudam.

---

## SEO — o que já está feito

**Conteúdo e marcação**
- Título, descrição e `og:` com os termos e a cidade na frente.
- Um `<h1>` só, hierarquia `h2`/`h3` fechada, HTML semântico (`main`, `section`,
  `article`, `nav`, `footer`) e `lang="pt-BR"`.
- Seção **"Onde atendemos"** com os municípios — o bloco que responde à busca local.
- Cidade citada naturalmente no hero, nos serviços, no gelo, no FAQ e no rodapé.

**Dados estruturados** (`<script type="application/ld+json">` no fim do `index.html`)
Um `@graph` com quatro nós: `WebSite`, `WebPage`, `HVACBusiness`/`LocalBusiness`
(telefone, horário, `areaServed` das 5 cidades e um catálogo com 10 ofertas) e
`FAQPage` com as 9 perguntas.
As perguntas do `FAQPage` repetem **palavra por palavra** as que estão na tela —
o Google exige isso, e divergir custa o rich result.

**Desempenho** (Core Web Vitals)
- **Zero recursos de terceiros.** As fontes Inter e Outfit são auto-hospedadas
  (arquivos variáveis, subconjunto latino, 80 KB somados) e pré-carregadas.
  A fonte do título é o maior elemento da primeira tela — ela não espera mais
  DNS + TLS + download de outro domínio.
- Ícones em SVG inline, uma folha de estilo, um script, nenhuma biblioteca.
- `_headers` com cache longo e imutável para fontes, curto e revalidado para HTML.

**Infraestrutura**
`robots.txt`, `sitemap.xml`, `canonical`, `site.webmanifest`, 404 próprio
com CTA, e cabeçalhos de segurança (`nosniff`, `X-Frame-Options`, HSTS,
`Referrer-Policy`, `Permissions-Policy`).

### O que dá mais resultado agora, e não é código

1. **Perfil da Empresa no Google** (Google Business Profile). Para busca local,
   isso pesa mais que a página inteira: é o que coloca a JMS no mapa e no bloco
   de resultados locais. Ao criar, use o mesmo nome, telefone e endereço do site.
2. **Endereço completo.** Hoje os dados estruturados têm só cidade/UF. Com rua,
   número e CEP em `index.html` (`PostalAddress`), o `LocalBusiness` fica completo.
3. **Avaliações reais** no perfil do Google e em `depoimentos[]`.
4. **Instagram** preenchido no `config.js` — entra como `sameAs` no schema.
5. **Domínio próprio.** `.workers.dev` funciona, mas um `jmsrefrigeracao.com.br`
   é melhor para confiança e para o Google.

---

## Estrutura

```
public/
  index.html              a página inteira: conteúdo, SEO e dados estruturados
  404.html                erro com CTA de WhatsApp
  robots.txt  sitemap.xml  site.webmanifest
  _headers                segurança e cache (lido pelo Cloudflare)
  assets/
    css/style.css         folha única: fontes → tokens → base → componentes → responsivo
    js/config.js          ⬅ DADOS DO NEGÓCIO
    js/main.js            CTAs, menu, FAQ, máscara, formulários, schema
    fonts/*.woff2         Inter e Outfit auto-hospedadas
    img/logo.svg          logo e favicon
    img/og.png            imagem de compartilhamento (1200×630)
```

## Rodar localmente

```bash
npx wrangler dev
```

Ou qualquer servidor estático apontando para `public/`
(abrir o `index.html` pelo arquivo **não funciona** — os caminhos são absolutos).

## Publicar

```bash
npx wrangler deploy
```

Conta Cloudflare: `ryzecode08@gmail.com`. Configuração em `wrangler.jsonc`.

> O projeto nasceu no Cloudflare Pages, que passou a fazer parte do Cloudflare
> Workers — por isso `wrangler deploy`, e não `wrangler pages deploy`.

## Domínio próprio

Painel do Cloudflare → Workers & Pages → `jms-refrigeracao` → Domains & Routes.
Depois de apontar, trocar a URL em quatro lugares: `site` no `config.js`, o
`canonical` e as `og:`/`twitter:` no `index.html`, o `sitemap.xml` e o `robots.txt`.
