// Troca o endereço público do site em todos os lugares de uma vez.
//
//   node ferramentas/trocar-dominio.mjs https://novo-endereco.com.br
//
// Lê o endereço atual do <link rel="canonical"> do index.html e troca em:
// index.html (canonical, og:, twitter:, JSON-LD), sitemap.xml, robots.txt e
// assets/js/config.js. Não publica nada. Depois rode `npm test`.

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const novo = (process.argv[2] || '').replace(/\/+$/, '');
if (!/^https:\/\/[a-z0-9.-]+$/i.test(novo)) {
  console.error('Uso: node ferramentas/trocar-dominio.mjs https://novo-endereco');
  process.exit(1);
}

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const index = readFileSync(join(raiz, 'index.html'), 'utf8');
const atual = ((index.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || '').replace(/\/+$/, '');
if (!atual) {
  console.error('Não achei o canonical no index.html.');
  process.exit(1);
}
if (atual === novo) {
  console.log('O site já aponta para ' + novo + '. Nada a fazer.');
  process.exit(0);
}

for (const f of ['index.html', 'sitemap.xml', 'robots.txt', 'assets/js/config.js']) {
  const p = join(raiz, f);
  const antes = readFileSync(p, 'utf8');
  const n = antes.split(atual).length - 1;
  writeFileSync(p, antes.split(atual).join(novo));
  console.log(f + ': ' + n + ' troca(s)');
}
console.log('De ' + atual + ' para ' + novo + '. Rode `npm test` para conferir.');
