# Endereço do site: opções

Hoje o site está em `https://jms-refrigeracao.desbravando-utv.workers.dev`, na conta Cloudflare `ryzecode08` (apelido `ryze` no `cf.ps1`). O subdomínio `desbravando-utv` é o da conta inteira e leva o nome de outro cliente. Ele aparece no canonical, no `og:`, no sitemap, no robots e no JSON-LD, ou seja, é o endereço que o Google guarda.

Trocar o subdomínio da conta não resolve: ele vale para todos os Workers dela (eventos, minidrive e outros do Desbravando) e quebraria esses links.

## Opção A. Mudar para a conta RYZE (`ryzecode.workers.dev`)

Endereço novo: `https://jms-refrigeracao.ryzecode.workers.dev`

- Custo: zero. Static assets são grátis e ilimitados no Workers Free.
- Pronto no branch `revisao-2026-11`: URL trocada pelo `ferramentas/trocar-dominio.mjs`, `account_id` da conta RYZE fixado no `wrangler.jsonc` (deploy na conta errada fica impossível) e o teste passa a barrar `desbravando-utv`.
- Limite: continua sendo `workers.dev`, que passa menos confiança e não é o melhor para SEO local.

Passos, quando o Pedro decidir:

```powershell
cd C:\Users\olive\Projetos\jms-refrigeracao
git checkout revisao-2026-11
npm test
& "C:\Users\olive\Projetos\manutencao-xps\cf.ps1" usar pessoal npx wrangler deploy
# conferir https://jms-refrigeracao.ryzecode.workers.dev no celular
git checkout main; git merge revisao-2026-11; git push
```

Depois, na conta `ryze` (Desbravando), o Worker antigo `jms-refrigeracao` pode virar um redirecionamento 301 para o endereço novo ou ser apagado. O site não está no Search Console, então quase nada foi indexado e o custo de apagar é baixo. Quem tiver o link antigo salvo cai em erro se ele for apagado: o redirecionamento evita isso.

## Opção B. Domínio próprio

Exemplo: `jmsrefrigeracao.com.br` (conferir disponibilidade no Registro.br, cerca de R$ 40 por ano).

- O domínio fica no nome do dono do negócio, não do Pedro.
- DNS no Cloudflare (zona na conta onde o Worker estiver) e, no painel, Workers & Pages > `jms-refrigeracao` > Domains & Routes > Custom Domain.
- No código, um comando só: `node ferramentas/trocar-dominio.mjs https://jmsrefrigeracao.com.br` e `npm test`.
- Com domínio próprio vale cadastrar no Search Console e enviar o sitemap.
- É o endereço que deve entrar no Perfil da Empresa no Google.

## Recomendação

A agora (custo zero, tira o nome do outro cliente do ar) e B quando o dono do negócio registrar o domínio. Como o script troca tudo de uma vez, fazer A antes não cria retrabalho.
