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
    if (v) el.textContent = v;
  });

  // Sem telefone fixo cadastrado: some com tudo que depende dele.
  if (!soDigitos(C.telefone)) {
    $$('[data-jms-link="tel"]').forEach(function (el) { el.hidden = true; });
  }

  /* ---------------------------------------------------------------
     2. Links de contato
     data-wa="mensagem"  -> abre o WhatsApp com a mensagem pronta
     data-jms-link="tel|email|instagram"
     --------------------------------------------------------------- */
  var waNum = soDigitos(C.whatsapp);

  function linkWa(msg) {
    return 'https://wa.me/' + waNum + (msg ? '?text=' + encodeURIComponent(msg) : '');
  }

  $$('[data-wa]').forEach(function (a) {
    a.href = linkWa(a.getAttribute('data-wa'));
    a.target = '_blank';
    a.rel = 'noopener';
  });

  $$('[data-jms-link]').forEach(function (a) {
    var tipo = a.getAttribute('data-jms-link');
    if (tipo === 'tel' && soDigitos(C.telefone)) {
      a.href = 'tel:+55' + soDigitos(C.telefone);
    } else if (tipo === 'email' && C.email) {
      a.href = 'mailto:' + C.email;
    } else if (tipo === 'instagram') {
      if (C.instagram) { a.href = C.instagram; a.target = '_blank'; a.rel = 'noopener'; }
      else { a.hidden = true; }
    }
  });

  // Aviso em desenvolvimento: número ainda é o de exemplo.
  if (!waNum || /^55000/.test(waNum)) {
    console.warn('[JMS] O WhatsApp ainda está com o número de exemplo. Edite /assets/js/config.js antes de divulgar o site.');
  }

  /* ---------------------------------------------------------------
     3. Dados estruturados (SEO) espelham o config
     Evita o site ter dois lugares com o mesmo telefone divergindo.
     --------------------------------------------------------------- */
  (function () {
    var tag = document.getElementById('ld-json');
    if (!tag) return;
    try {
      var ld = JSON.parse(tag.textContent);
      if (waNum) ld.telephone = '+' + waNum;
      if (C.email) ld.email = C.email;
      if (C.site) {
        ld.url = C.site + '/';
        ld.image = C.site + '/assets/img/og.png';
      }
      if (C.cidade) {
        ld.address.addressLocality = C.cidade;
        ld.areaServed.name = C.cidade;
      }
      if (C.uf) ld.address.addressRegion = C.uf;
      if (C.instagram) ld.sameAs = [C.instagram];
      tag.textContent = JSON.stringify(ld);
    } catch (e) { /* JSON inválido não pode derrubar o site */ }
  })();

  /* ---------------------------------------------------------------
     4. Depoimentos — a seção só existe se houver depoimento real
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

  function escapar(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------------------------------------------------------------
     5. Menu mobile
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
     6. Sombra do cabeçalho ao rolar
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
     7. FAQ: um aberto por vez
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
     8. Entrada dos blocos ao rolar
     --------------------------------------------------------------- */
  (function () {
    var alvos = $$('.reveal');
    if (!alvos.length) return;

    if (!('IntersectionObserver' in window)) {
      alvos.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    alvos.forEach(function (el, i) {
      // escalona os itens de uma mesma linha para a entrada não ser em bloco
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  })();

  /* ---------------------------------------------------------------
     9. Máscara de telefone
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
     10. Formulários -> WhatsApp
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

      window.open(linkWa(linhas.join('\n')), '_blank', 'noopener');
    });

    // Some com o erro assim que a pessoa começa a corrigir.
    form.addEventListener('input', function (e) {
      var wrap = e.target.closest('.field');
      if (wrap && e.target.value.trim()) wrap.classList.remove('is-invalid');
    });
  });

  /* ---------------------------------------------------------------
     11. Ano do rodapé
     --------------------------------------------------------------- */
  var ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

})();
