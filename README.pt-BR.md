# JMS Refrigeração e Gelo · site

[English](README.md) · Português

Site estático de uma página para um pequeno negócio de refrigeração, ar-condicionado e entrega de gelo em João Pessoa. Todo botão abre o WhatsApp com a mensagem já escrita. Sem backend, sem banco, sem build.

## Status

No ar desde 17/09/2026, no Cloudflare Workers (assets estáticos).
Endereço atual: https://jms-refrigeracao.desbravando-utv.workers.dev

O subdomínio `workers.dev` leva o nome da conta Cloudflare de outro cliente. A troca está planejada: ver [docs/DOMINIO.md](docs/DOMINIO.md) e [docs/ROADMAP.md](docs/ROADMAP.md).

## O problema

O negócio recebe pedido pelo WhatsApp e precisa aparecer na busca local. Formulário que manda e-mail cai numa caixa que ninguém abre. Aqui os 34 pontos de ação da página abrem a conversa com a mensagem pronta e o contexto junto ("quero gelo em escama", "meu ar parou"). Os dois formulários montam a mensagem com nome, telefone e assunto e entregam a conversa. O site não guarda nada.

## Editar os dados do negócio

O `public/assets/js/config.js` é o único arquivo de dados do negócio. Ele alimenta os links de WhatsApp, telefone, e-mail e Instagram opcionais (vazio, a linha some), a lista de cidades atendidas, o rodapé e os dados estruturados.

A cidade também aparece direto no `index.html` (`<title>`, meta description, canonical, `og:`), porque o Google precisa ler isso no HTML. Ao mudar, mude nos dois.

Para trocar o endereço público em todos os lugares de uma vez:

```bash
node ferramentas/trocar-dominio.mjs https://novo-endereco
npm test
```

Os arquivos são chamados com versão na URL (`style.css?v=20260917b`). Quando uma mudança de CSS ou JS precisa aparecer na hora para quem já visitou, troque o `?v=` no `index.html` e no `404.html`.

## Publicar

```bash
npx wrangler deploy
```

Sempre pelo `cf.ps1` com a conta certa (ver `docs/DOMINIO.md`). O projeto nasceu no Cloudflare Pages, que virou parte do Workers, por isso é `wrangler deploy` e não `wrangler pages deploy`.

## Stack

- HTML, CSS e JavaScript puros, sem framework e sem build.
- Cloudflare Workers com assets estáticos (`wrangler.jsonc`, pasta `public/`).
- Fontes Inter e Outfit auto-hospedadas (variáveis, subconjunto latino). Nenhuma requisição a terceiros.
- `_headers` com cabeçalhos de segurança e regras de cache.

## Rodar localmente

```bash
npx wrangler dev
```

Qualquer servidor estático apontando para `public/` também serve. Abrir o `index.html` direto do disco não funciona, porque os caminhos são absolutos.

## Testes

```bash
npm test
```

O `tests/checar-site.mjs` lê os arquivos de `public/` sem subir servidor e confere que:

1. canonical, Open Graph, Twitter, sitemap, robots e `config.js` apontam para a mesma URL base, assim como toda URL do JSON-LD;
2. o JSON-LD é válido;
3. as perguntas do FAQPage repetem palavra por palavra, e na mesma ordem, as perguntas da tela (o Google exige);
4. todo arquivo local chamado pelo `index.html` e pelo `404.html` existe;
5. nenhuma URL pública cita um subdomínio da lista `HOSTS_PROIBIDOS`.

## Pastas

```
public/
  index.html            a página inteira: conteúdo, SEO e dados estruturados
  404.html              erro com CTA de WhatsApp
  robots.txt  sitemap.xml  site.webmanifest
  _headers              segurança e cache (lido pelo Cloudflare)
  assets/css/style.css  folha única
  assets/js/config.js   dados do negócio
  assets/js/main.js     CTAs, menu, FAQ, máscara, formulários, schema
  assets/fonts/         Inter e Outfit
  assets/img/           logo, favicon, imagem de compartilhamento
ferramentas/            scripts de manutenção (não vão para o ar)
tests/                  conferências estáticas (npm test)
docs/                   roadmap, opções de domínio, arquitetura
```

## Arquitetura

Ver [docs/arquitetura/](docs/arquitetura/README.md): casos de uso (UML), processo (BPMN) e containers (C4).

## Decisões e limites conhecidos

- Sem preço e sem depoimento na página, de propósito. A seção de depoimentos fica escondida até `depoimentos[]` ter avaliação real.
- O horário de atendimento saiu porque nunca foi confirmado. Volta preenchendo `horario` no `config.js` e repondo o bloco `openingHoursSpecification` no JSON-LD.
- O endereço estruturado tem só cidade e UF. O `PostalAddress` completo depende do endereço real.
- A lista de cidades (`cidades[]`) é uma afirmação pública de cobertura e precisa ser confirmada pelo negócio.
- O que mais ajuda na busca local não é código: Perfil da Empresa no Google e domínio próprio.

## Licença

Todos os direitos reservados. Publicado como portfólio; não licenciado para reuso. Veja o arquivo [LICENSE](LICENSE). Nome, textos e logo pertencem ao negócio.
