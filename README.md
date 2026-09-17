# JMS Refrigeração e Gelo — site institucional

Site de uma página, estático, focado em conversão por WhatsApp.
Sem backend, sem banco, sem build: são arquivos soltos servidos pelo **Cloudflare Pages**.

---

## O que precisa ser feito antes de divulgar

Tudo que é dado do negócio está em **um arquivo só**:

📄 [`public/assets/js/config.js`](public/assets/js/config.js)

| Campo | O que é | Estado |
|---|---|---|
| `whatsapp` | número só com dígitos, `55` + DDD + número | ⚠️ exemplo |
| `whatsappExibicao` | como o número aparece escrito | ⚠️ exemplo |
| `telefone` / `telefoneExibicao` | fixo (deixe `""` para sumir do site) | ⚠️ exemplo |
| `email` | e-mail de contato | ⚠️ exemplo |
| `instagram` | URL completa (deixe `""` para esconder o ícone) | vazio |
| `cidade`, `uf`, `endereco` | região de atendimento | ⚠️ exemplo |
| `horario` | horário de funcionamento | conferir |
| `cnpj` | linha do rodapé (deixe `""` para omitir) | vazio |
| `site` | domínio final, sem barra no fim | pages.dev |
| `depoimentos` | lista de avaliações reais | vazio |

Esses valores alimentam, em tempo de carregamento: os ~25 botões de WhatsApp,
os links de telefone e e-mail, os textos de cidade/horário, o rodapé e o bloco
de **dados estruturados** que o Google lê (`HVACBusiness`).

> Enquanto o número for o de exemplo, o console do navegador avisa.
> **Nenhum depoimento foi inventado**: a seção fica escondida até você preencher a lista.

### Também revisar antes de divulgar

- **Promessas do site**: "garantia no serviço", "equipe técnica própria",
  "atendimento de urgência", "prioridade para contrato". São afirmações comerciais
  padrão do setor — confirme que todas valem para a JMS ou ajuste o texto.
- **`public/sitemap.xml` e `public/robots.txt`**: trocar o domínio quando sair do `.pages.dev`.
- **`public/index.html`**: a tag `<link rel="canonical">` e as meta `og:` também
  carregam o domínio (o resto do SEO é preenchido pelo `config.js`).

---

## Estrutura

```
public/
  index.html              página única (todo o conteúdo e o SEO)
  404.html                página de erro com CTA
  robots.txt  sitemap.xml
  _headers                cabeçalhos de segurança e cache (lido pelo Pages)
  assets/
    css/style.css         folha única: tokens → base → componentes → seções → responsivo
    js/config.js          ⬅ DADOS DO NEGÓCIO (o único arquivo que se edita no dia a dia)
    js/main.js            comportamento: links, menu, FAQ, máscara, formulários
    img/logo.svg          logo e favicon
    img/og.png            imagem de compartilhamento (1200×630)
```

### Por que o formulário não tem backend

Os dois formulários (hero e contato) **não enviam nada para lugar nenhum**: eles montam
a mensagem e abrem o WhatsApp já preenchido. Isso elimina servidor, custo, LGPD de
armazenamento e o risco clássico de formulário que envia e-mail para uma caixa que
ninguém lê. O lead chega onde a JMS já atende.

---

## Rodar localmente

```bash
npx wrangler pages dev public
```

Ou qualquer servidor estático apontando para `public/`
(abrir o `index.html` direto pelo arquivo **não funciona** — os caminhos são absolutos).

## Publicar

```bash
npx wrangler pages deploy public --project-name=jms-refrigeracao
```

Conta Cloudflare: `ryzecode08@gmail.com`.
Cada `deploy` gera uma URL de preview e atualiza a URL de produção.

## Domínio próprio

No painel do Cloudflare → Workers & Pages → `jms-refrigeracao` → Custom domains.
Depois de apontar, atualizar `site` no `config.js`, o `canonical`/`og:` no
`index.html`, o `sitemap.xml` e o `robots.txt`.
