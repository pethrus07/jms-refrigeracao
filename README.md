[Português](README.pt-BR.md) | English

# JMS Refrigeração e Gelo · website

One-page static website for a small refrigeration, air conditioning and ice delivery business in João Pessoa, Brazil. Every call to action opens WhatsApp with a ready-made message. There is no backend, no database and no build step.

## Status

In production since 2026-09-17, on Cloudflare Workers (static assets).
Address after the move (branch `revisao-2026-11`, not deployed yet): https://jms-refrigeracao.ryzecode.workers.dev, on the RYZE Cloudflare account (`account_id` pinned in `wrangler.jsonc`). Until deploy, production is still at https://jms-refrigeracao.desbravando-utv.workers.dev

The `workers.dev` subdomain carries the name of another client's Cloudflare account. Moving it is planned: see [docs/DOMINIO.md](docs/DOMINIO.md) (in Portuguese) and [docs/ROADMAP.md](docs/ROADMAP.md).

## The problem it solves

The business gets orders by WhatsApp and needs to show up in local search. A contact form that sends e-mail would land in an inbox nobody reads. Here, all 34 action points on the page open a WhatsApp chat with a message that already says what the visitor wants ("I need flake ice", "my AC stopped"). The two forms build the message from name, phone and subject, and hand over the chat. Nothing is stored by the site.

## Stack

- Plain HTML, CSS and JavaScript, no framework, no build.
- Cloudflare Workers with static assets (`wrangler.jsonc`, folder `public/`).
- Self-hosted Inter and Outfit fonts (variable, Latin subset). Zero third-party requests.
- `_headers` for security headers and cache rules.

## Run locally

```bash
npx wrangler dev
```

Any static server pointed at `public/` also works. Opening `index.html` straight from disk does not, because paths are absolute.

## Tests

```bash
npm test
```

`tests/checar-site.mjs` reads the files in `public/` without starting a server and checks that:

1. canonical, Open Graph, Twitter, sitemap, robots and `config.js` all point to the same base URL, and so does every URL in the JSON-LD;
2. the JSON-LD parses;
3. the FAQPage questions match the questions on screen word for word and in order (Google requires it);
4. every local file referenced by `index.html` and `404.html` exists;
5. no public URL mentions a subdomain listed in `HOSTS_PROIBIDOS`.

## Editing the business data

`public/assets/js/config.js` is the only file to edit for business data. It feeds every WhatsApp link, the optional phone, e-mail and Instagram (empty means the line disappears), the list of served cities, the footer and the structured data.

The city also appears directly in `index.html` (`<title>`, meta description, canonical, `og:`), because Google has to read it in the HTML. Change it in both places.

To change the public address everywhere at once:

```bash
node ferramentas/trocar-dominio.mjs https://new-address
npm test
```

Assets are loaded with a version in the URL (`style.css?v=20260917b`). When a CSS or JS change must show up immediately for returning visitors, bump `?v=` in `index.html` and `404.html`.

## Folder structure

```
public/
  index.html            the whole page: content, SEO and structured data
  404.html              error page with a WhatsApp call to action
  robots.txt  sitemap.xml  site.webmanifest
  _headers              security and cache (read by Cloudflare)
  assets/css/style.css  single stylesheet
  assets/js/config.js   business data
  assets/js/main.js     CTAs, menu, FAQ, input mask, forms, schema
  assets/fonts/         Inter and Outfit
  assets/img/           logo, favicon, share image
ferramentas/            maintenance scripts (not served)
tests/                  static checks (npm test)
docs/                   roadmap, domain options, architecture
```

## Architecture

See [docs/arquitetura/](docs/arquitetura/README.md): use cases (UML), process (BPMN) and containers (C4).

## Decisions and known limits

- No prices and no testimonials on the page on purpose. The testimonials section stays hidden until `depoimentos[]` has real reviews.
- Opening hours were removed because they were never confirmed. They come back in `config.js` (`horario`) plus an `openingHoursSpecification` block in the JSON-LD.
- The structured address has only city and state. A full `PostalAddress` needs the real street address.
- The served cities list (`cidades[]`) is a public claim about coverage and must be confirmed by the business.
- What would help local search most is not code: a Google Business Profile and a domain of its own.

## Deploy

```bash
npx wrangler deploy
```

Run it through `cf.ps1` with the right account (see `docs/DOMINIO.md`). The project started on Cloudflare Pages, which is now part of Workers, so it is `wrangler deploy` and not `wrangler pages deploy`.

## License

All rights reserved. The business name, texts and logo belong to the business.
