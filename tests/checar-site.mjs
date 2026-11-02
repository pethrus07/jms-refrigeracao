// Conferência estática do site. Não sobe servidor e não muda nada:
// lê os arquivos de public/ e falha se o SEO ou os caminhos divergirem.
//
//   npm test
//
// O que confere:
//   1. Uma URL base só: canonical, og:, twitter:, sitemap, robots, config.js e
//      todo @id/url do JSON-LD apontam para o mesmo endereço.
//   2. O JSON-LD é JSON válido.
//   3. As perguntas do FAQPage repetem, palavra por palavra e na mesma ordem,
//      as perguntas que aparecem na tela (o Google exige isso).
//   4. Todo arquivo local chamado pelo index.html e pelo 404.html existe.
//   5. Nenhuma URL pública cita um subdomínio que não seja deste projeto
//      (lista em HOSTS_PROIBIDOS).

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const ler = (f) => readFileSync(join(raiz, f), 'utf8');

// Subdomínios de outros clientes que não podem aparecer no SEO deste site.
const HOSTS_PROIBIDOS = ['desbravando-utv'];

let falhas = 0;
let ok = 0;
function confere(cond, msg) {
  if (cond) { ok++; return; }
  falhas++;
  console.error('FALHOU: ' + msg);
}

const index = ler('index.html');
const p404 = ler('404.html');
const sitemap = ler('sitemap.xml');
const robots = ler('robots.txt');
const config = ler('assets/js/config.js');

// 1. URL base única
const canonical = (index.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
confere(!!canonical, 'index.html sem <link rel="canonical">');
const base = (canonical || '').replace(/\/+$/, '');

const metas = [...index.matchAll(/<meta (?:property|name)="(og:url|og:image|twitter:image)" content="([^"]+)"/g)];
confere(metas.length === 3, 'esperava og:url, og:image e twitter:image (achou ' + metas.length + ')');
for (const [, nome, url] of metas) {
  confere(url.startsWith(base + '/'), nome + ' fora da base: ' + url);
}

const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
confere(locs.length > 0, 'sitemap.xml sem <loc>');
for (const l of locs) confere(l.startsWith(base + '/'), 'sitemap fora da base: ' + l);

const sm = (robots.match(/^Sitemap:\s*(\S+)/m) || [])[1];
confere(sm === base + '/sitemap.xml', 'robots.txt aponta para ' + sm + ', esperado ' + base + '/sitemap.xml');

const site = (config.match(/site:\s*"([^"]+)"/) || [])[1];
confere((site || '').replace(/\/+$/, '') === base, 'config.js site=' + site + ' difere do canonical ' + base);

// 2. JSON-LD válido e preso à base
const ldTxt = (index.match(/<script type="application\/ld\+json" id="ld-json">([\s\S]*?)<\/script>/) || [])[1];
confere(!!ldTxt, 'index.html sem <script id="ld-json">');
let ld = null;
try { ld = JSON.parse(ldTxt || ''); } catch (e) { confere(false, 'JSON-LD inválido: ' + e.message); }

if (ld) {
  const urls = [];
  (function varre(no) {
    if (Array.isArray(no)) return no.forEach(varre);
    if (no && typeof no === 'object') {
      for (const [k, v] of Object.entries(no)) {
        if ((k === '@id' || k === 'url' || k === 'image') && typeof v === 'string' && v.startsWith('http')) urls.push(v);
        else varre(v);
      }
    }
  })(ld);
  confere(urls.length > 0, 'JSON-LD sem nenhuma URL');
  for (const u of urls) confere(u.startsWith(base + '/'), 'JSON-LD fora da base: ' + u);

  // 3. FAQ da tela = FAQPage
  const tela = [...index.matchAll(/<summary>([\s\S]*?)<svg/g)].map((m) => m[1].trim());
  const faq = (ld['@graph'] || []).find((n) => n['@type'] === 'FAQPage');
  confere(!!faq, 'JSON-LD sem FAQPage');
  const schema = faq ? faq.mainEntity.map((q) => q.name) : [];
  confere(tela.length === schema.length, 'FAQ: ' + tela.length + ' perguntas na tela, ' + schema.length + ' no schema');
  tela.forEach((q, i) => confere(q === schema[i], 'FAQ ' + (i + 1) + ' diverge: "' + q + '" x "' + schema[i] + '"'));
}

// 4. Arquivos locais existem
for (const [nome, html] of [['index.html', index], ['404.html', p404]]) {
  const caminhos = [...html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)].map((m) => m[1].split('?')[0]);
  for (const c of caminhos) {
    if (c === '/') continue;
    confere(existsSync(join(raiz, c)), nome + ' chama ' + c + ', que não existe em public/');
  }
}

// 5. Nenhum subdomínio de outro cliente
const tudo = [index, p404, sitemap, robots, config].join('\n');
for (const h of HOSTS_PROIBIDOS) confere(!tudo.includes(h), 'URL pública cita ' + h);

console.log(ok + ' conferências passaram, ' + falhas + ' falharam. Base: ' + base);
process.exit(falhas ? 1 : 0);
