/* =========================================================
   JMS Refrigeração e Gelo — comportamento do site
   Sem dependências. Tudo que é dado do negócio vem de config.js.
   ========================================================= */
(function () {
  'use strict';

  var C = window.JMS || {};
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  var soDigitos = function (v) { return String(v || '').replace(/\D/g, ''); };

  function escapar(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------------------------------------------------------------
     1. Dados do negócio -> texto da página
     Cada elemento [data-jms="chave"] recebe o valor correspondente.
     --------------------------------------------------------------- */
  var textos = {
    whatsapp: C.whatsappExibicao,
    telefone: C.telefoneExibicao,
    email: C.email,
    cidade: C.cidade,
    endereco: C.endereco,
    horario: C.horario,
    cnpj: C.cnpj
  };

  $$('[data-jms]').forEach(function (el) {
    var v = textos[el.getAttribute('data-jms')];
    if (v) { el.textContent = v; return; }

    // Campo vazio no config (horário, telefone, CNPJ): a linha inteira do
    // cartão de contato some, em vez de ficar um rótulo sem valor ao lado.
    var linha = el.closest('.info');
    if (linha) linha.hidden = true;
  });

  /* ---------------------------------------------------------------
     2. Todos os CTAs vão para o WhatsApp

     data-wa="mensagem"  -> abre a conversa com essa mensagem
     data-wa=""          -> usa a mensagemPadrao do config
     mensagemPorBotao:false no config força a mensagemPadrao em todos.
     --------------------------------------------------------------- */
  var waNum = soDigitos(C.whatsapp);
  var padrao = C.mensagemPadrao || '';
  var porBotao = C.mensagemPorBotao !== false;

  function linkWa(msg) {
    var texto = (porBotao && msg) ? msg : (padrao || msg || '');
    return 'https://wa.me/' + waNum + (texto ? '?text=' + encodeURIComponent(texto) : '');
  }

  $$('[data-wa]').forEach(function (a) {
    a.href = linkWa(a.getAttribute('data-wa'));
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* Canais alternativos, ambos opcionais: vazios no config, a linha some
     da página. É por isso que [hidden] precisa do !important no CSS. */
  $$('[data-jms-link]').forEach(function (a) {
    var tipo = a.getAttribute('data-jms-link');
    var valor = tipo === 'tel' ? soDigitos(C.telefone)
              : tipo === 'email' ? C.email
              : C.instagram;

    if (!valor) { a.hidden = true; return; }

    if (tipo === 'tel') a.href = 'tel:+55' + valor;
    else if (tipo === 'email') a.href = 'mailto:' + valor;
    else { a.href = valor; a.target = '_blank'; a.rel = 'noopener'; }
  });

  if (!waNum || waNum.length < 12) {
    console.warn('[JMS] O número do WhatsApp em /assets/js/config.js parece incompleto:', C.whatsapp);
  }

  /* ---------------------------------------------------------------
     3. Lista de cidades atendidas (SEO local + seção "Onde atendemos")
     --------------------------------------------------------------- */
  (function () {
    var lista = Array.isArray(C.cidades) ? C.cidades : [];
    var ul = $('#cidades-lista');
    if (!ul || !lista.length) return;
    ul.innerHTML = lista.map(function (c) {
      return '<li class="reveal">' + escapar(c) + '</li>';
    }).join('');
  })();

  /* ---------------------------------------------------------------
     4. Dados estruturados (schema.org) espelham o config

     O @graph do HTML é a fonte da estrutura; o config manda no
     conteúdo. Assim o telefone não existe em dois lugares podendo
     divergir. Domínio inteiro é trocado de uma vez, porque ele
     aparece em todo @id do grafo.
     --------------------------------------------------------------- */
  (function () {
    var tag = document.getElementById('ld-json');
    if (!tag) return;

    try {
      var canonico = ($('link[rel="canonical"]') || {}).href || '';
      var dominioHtml = canonico.replace(/\/+$/, '');
      var dominioCfg = (C.site || '').replace(/\/+$/, '');

      var txt = tag.textContent;
      if (dominioCfg && dominioHtml && dominioCfg !== dominioHtml) {
        txt = txt.split(dominioHtml).join(dominioCfg);
      }

      var ld = JSON.parse(txt);
      var nos = ld['@graph'] || [ld];

      function ehTipo(no, t) {
        var x = no['@type'];
        return x === t || (Array.isArray(x) && x.indexOf(t) >= 0);
      }

      nos.forEach(function (no) {
        if (!ehTipo(no, 'LocalBusiness')) return;

        if (waNum) {
          no.telephone = '+' + waNum;
          if (no.contactPoint && no.contactPoint[0]) no.contactPoint[0].telephone = '+' + waNum;
        }
        if (C.email) no.email = C.email; else delete no.email;
        if (C.instagram) no.sameAs = [C.instagram];
        if (C.cidade) no.address.addressLocality = C.cidade;
        if (C.uf) no.address.addressRegion = C.uf;
        if (Array.isArray(C.cidades) && C.cidades.length) {
          no.areaServed = C.cidades.map(function (c) {
            return { '@type': 'City', name: c };
          });
        }
      });

      tag.textContent = JSON.stringify(ld);
    } catch (e) {
      /* JSON malformado não pode derrubar o site: o Google lê o que estiver no HTML */
    }
  })();

  /* ---------------------------------------------------------------
     5. Depoimentos — a seção só existe se houver depoimento real
     --------------------------------------------------------------- */
  (function () {
    var lista = Array.isArray(C.depoimentos) ? C.depoimentos : [];
    var sec = $('#depoimentos');
    var grid = $('#depoimentos-grid');
    if (!sec || !grid || !lista.length) return;

    grid.innerHTML = lista.map(function (d) {
      var nota = Math.max(0, Math.min(5, d.nota || 5));
      var estrelas = '';
      for (var i = 0; i < nota; i++) estrelas += '<svg class="ic"><use href="#i-star"/></svg>';
      return '<article class="depo">' +
        '<div class="depo__stars" aria-label="' + nota + ' de 5">' + estrelas + '</div>' +
        '<p>' + escapar(d.texto) + '</p>' +
        '<footer><strong>' + escapar(d.nome) + '</strong>' + escapar(d.cargo || '') + '</footer>' +
        '</article>';
    }).join('');
    sec.hidden = false;
  })();

  /* ---------------------------------------------------------------
     6. Menu mobile
     --------------------------------------------------------------- */
  (function () {
    var burger = $('#burger');
    var nav = $('#nav');
    if (!burger || !nav) return;

    function fechar() {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Abrir menu');
    }

    burger.addEventListener('click', function () {
      var aberto = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      burger.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) fechar();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fechar();
    });

    // Volta ao desktop com o menu aberto: limpa o estado.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) fechar();
    });
  })();

  /* ---------------------------------------------------------------
     7. Sombra do cabeçalho ao rolar
     --------------------------------------------------------------- */
  (function () {
    var header = $('#header');
    if (!header) return;
    var tick = false;
    function atualizar() {
      header.classList.toggle('is-stuck', window.scrollY > 8);
      tick = false;
    }
    window.addEventListener('scroll', function () {
      if (!tick) { tick = true; requestAnimationFrame(atualizar); }
    }, { passive: true });
    atualizar();
  })();

  /* ---------------------------------------------------------------
     8. FAQ: um aberto por vez
     --------------------------------------------------------------- */
  (function () {
    var itens = $$('.faq__item');
    itens.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        itens.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  })();

  /* ---------------------------------------------------------------
     9. Entrada dos blocos ao rolar

     O CSS só esconde .reveal quando a raiz tem a classe .js, marcada
     no <head> antes da primeira pintura. Se este script não rodar, a
     marca cai sozinha em 3s e o site aparece inteiro — conteúdo
     comercial não pode depender de animação.

     A margem do observador é em PIXELS, não em %: em tela muito alta
     uma margem percentual vira centenas de pixels e blocos legítimos
     deixam de ser revelados.
     --------------------------------------------------------------- */
  (function () {
    var raiz = document.documentElement;
    var alvos = $$('.reveal');

    // Avisa o script do <head> que a revelação tem dono.
    window.__jmsReveal = true;

    var reduzido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!alvos.length || reduzido || !('IntersectionObserver' in window)) {
      raiz.classList.remove('js'); // sem animação: tudo visível de uma vez
      return;
    }

    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0 });

    alvos.forEach(function (el, i) {
      // escalona os itens de uma mesma linha para a entrada não ser em bloco
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });

    // Rede de segurança: o que já estiver na tela e continuar escondido
    // depois de 2s aparece de qualquer jeito.
    setTimeout(function () {
      var alturaTela = window.innerHeight || 800;
      alvos.forEach(function (el) {
        if (el.classList.contains('is-in')) return;
        if (el.getBoundingClientRect().top < alturaTela) {
          el.classList.add('is-in');
          io.unobserve(el);
        }
      });
    }, 2000);
  })();

  /* ---------------------------------------------------------------
     10. Máscara de telefone
     --------------------------------------------------------------- */
  $$('[data-mask="fone"]').forEach(function (inp) {
    inp.addEventListener('input', function () {
      var v = soDigitos(inp.value).slice(0, 11);
      if (v.length > 10) inp.value = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      else if (v.length > 6) inp.value = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      else if (v.length > 2) inp.value = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      else if (v.length) inp.value = '(' + v;
      else inp.value = '';
    });
  });

  /* ---------------------------------------------------------------
     11. Formulários -> WhatsApp
     Não há backend: o formulário monta a mensagem e entrega a
     conversa já preenchida. Zero dado armazenado no site.
     --------------------------------------------------------------- */
  $$('#form-hero, #form-contato').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var faltando = [];
      $$('[required]', form).forEach(function (campo) {
        var wrap = campo.closest('.field');
        var vazio = !campo.value.trim();
        if (wrap) wrap.classList.toggle('is-invalid', vazio);
        if (vazio) faltando.push(campo);
      });

      if (faltando.length) {
        faltando[0].focus();
        return;
      }

      var d = new FormData(form);
      var linhas = [
        'Olá! Vim pelo site da JMS Refrigeração e Gelo.',
        '',
        'Nome: ' + (d.get('nome') || ''),
        'WhatsApp: ' + (d.get('fone') || ''),
        'Assunto: ' + (d.get('assunto') || '')
      ];
      if (d.get('local')) linhas.push('Cidade/bairro: ' + d.get('local'));
      if (d.get('msg')) linhas.push('', 'Detalhe: ' + d.get('msg'));

      window.open('https://wa.me/' + waNum + '?text=' + encodeURIComponent(linhas.join('\n')), '_blank', 'noopener');
    });

    // Some com o erro assim que a pessoa começa a corrigir.
    form.addEventListener('input', function (e) {
      var wrap = e.target.closest('.field');
      if (wrap && e.target.value.trim()) wrap.classList.remove('is-invalid');
    });
  });

  /* ---------------------------------------------------------------
     12. Ano do rodapé
     --------------------------------------------------------------- */
  var ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

})();
