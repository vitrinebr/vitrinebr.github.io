/* vitrinebr: monta a grade de lojas a partir de js/lojas.js */
(() => {
  const $ = (s) => document.querySelector(s);
  const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const link = (l) => (/^https?:\/\//.test(l.endereco) ? l.endereco : `${l.endereco.replace(/^\/|\/$/g, '')}/`);
  const SETA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  let filtro = 'Todas';

  function render() {
    const lista = LOJAS.filter((l) => filtro === 'Todas' || l.categoria === filtro);
    $('#grade').innerHTML = lista.map((l, i) => `
      <a class="loja" href="${esc(link(l))}" style="--atraso:${i * 80}ms;--cor:${esc(l.cor || '')}">
        <div class="loja__capa">
          <img src="${esc(l.capa)}" alt="" loading="${i < 3 ? 'eager' : 'lazy'}">
          ${l.logo ? `<span class="loja__logo" style="background:${esc(l.fundoLogo || '#fff')}"><img src="${esc(l.logo)}" alt="${esc(l.nome)}"></span>` : ''}
        </div>
        <div class="loja__corpo">
          <span class="loja__meta"><i></i>${esc(l.categoria)}${l.segmento ? ` · ${esc(l.segmento)}` : ''}</span>
          <h2>${esc(l.nome)}</h2>
          <p>${esc(l.descricao)}</p>
          <span class="loja__ir">Visitar vitrine ${SETA}</span>
        </div>
      </a>`).join('') + (filtro === 'Todas' && LOJAS.length < 3 ? `
      <div class="loja loja--breve" style="--atraso:${lista.length * 80}ms" aria-hidden="true">
        <svg viewBox="0 0 32 32"><path d="M4 12 6.5 5h19L28 12M4 12c0 2 1.6 3.4 3.5 3.4S11 14 11 12c0 2 1.6 3.4 3.5 3.4h3c1.9 0 3.5-1.4 3.5-3.4 0 2 1.6 3.4 3.5 3.4S28 14 28 12ZM6.5 16v11h19V16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
        <strong>Novas vitrines em breve</strong>
        Mais lojas e ateliês chegando por aqui.
      </div>` : '');
    document.querySelectorAll('.filtro').forEach((b) => b.classList.toggle('ativo', b.dataset.cat === filtro));
  }

  // Filtros só aparecem quando há mais de uma categoria
  const categorias = [...new Set(LOJAS.map((l) => l.categoria))];
  if (categorias.length > 1) {
    const f = $('#filtros');
    f.hidden = false;
    ['Todas', ...categorias].forEach((c) => {
      const b = document.createElement('button');
      b.className = 'filtro';
      b.dataset.cat = c;
      b.textContent = c;
      b.addEventListener('click', () => { filtro = c; render(); });
      f.append(b);
    });
  }

  $('#conta').textContent = `${LOJAS.length} ${LOJAS.length === 1 ? 'vitrine' : 'vitrines'}`;
  $('#ano').textContent = new Date().getFullYear();

  if (VITRINEBR.contato) {
    $('#convite').hidden = false;
    $('#convite-link').href = VITRINEBR.contato;
    $('#convite-link').textContent = VITRINEBR.contatoTexto || 'Quero uma vitrine';
  }

  /* ---------- Movimento ---------- */
  const html = document.documentElement;
  const semMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Revela ao entrar na tela; ao sair por baixo, esconde de novo para repetir
  const obs = !semMovimento && 'IntersectionObserver' in window
    ? new IntersectionObserver((itens) => itens.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('visivel');
      else if (e.boundingClientRect.top > 0) e.target.classList.remove('visivel');
    }), { rootMargin: '0px 0px -10% 0px', threshold: 0.12 })
    : null;
  // Enquanto a porta está fechada, espera para não animar escondido
  let liberar;
  const liberado = html.classList.contains('porta-espera') ? new Promise((r) => { liberar = r; }) : Promise.resolve();
  const observar = (els) => liberado.then(() => els.forEach((el) => (obs ? obs.observe(el) : el.classList.add('visivel'))));

  const renderBase = render;
  render = function () {
    renderBase();
    document.querySelectorAll('.loja').forEach((el) => el.classList.add('revelar'));
    observar(document.querySelectorAll('.loja'));
  };

  // Card inclina acompanhando o mouse
  if (!semMovimento && matchMedia('(hover: hover)').matches) {
    $('#grade').addEventListener('pointermove', (e) => {
      const card = e.target.closest('.loja:not(.loja--breve)');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 10}deg`);
      card.style.setProperty('--rx', `${(0.5 - (e.clientY - r.top) / r.height) * 8}deg`);
    });
    $('#grade').addEventListener('pointerout', (e) => {
      const card = e.target.closest('.loja');
      if (card && !card.contains(e.relatedTarget)) { card.style.removeProperty('--rx'); card.style.removeProperty('--ry'); }
    });
  }

  // Rolagem: progresso, título, letreiro e o balanço do toldo
  const progresso = $('#progresso');
  const linhas = [...document.querySelectorAll('.letreiro__linha')];
  const toldo = $('.toldo__pano');
  let ultimoY = scrollY;
  let vel = 0;
  let pedido = false;
  function aoRolar() {
    pedido = false;
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progresso.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    if (semMovimento) return;
    html.style.setProperty('--r', Math.min(y, 500).toFixed(1));
    linhas.forEach((l) => {
      const r = l.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const t = (innerHeight - r.top) / (innerHeight + r.height); // 0 → 1 enquanto passa pela tela
      const faixa = l.scrollWidth / 3;
      const x = l.dataset.sentido === '1' ? -t * faixa : -faixa + t * faixa;
      l.style.setProperty('--x', x.toFixed(1));
    });
    // o toldo balança conforme a velocidade da rolagem
    vel = Math.max(-8, Math.min(8, (y - ultimoY) * 0.4));
    ultimoY = y;
    toldo.style.setProperty('--vel', vel.toFixed(2));
    clearTimeout(aoRolar.t);
    aoRolar.t = setTimeout(() => toldo.style.setProperty('--vel', 0), 120);
  }
  addEventListener('scroll', () => { if (!pedido) { pedido = true; requestAnimationFrame(aoRolar); } }, { passive: true });
  addEventListener('resize', aoRolar);

  observar(document.querySelectorAll('.toldo, .convite'));

  // Abertura: a porta sobe e libera a página
  if (html.classList.contains('porta-fechada')) {
    const soltar = () => { html.classList.remove('porta-espera'); liberar(); };
    const abrir = () => { soltar(); html.classList.remove('porta-fechada'); };
    setTimeout(soltar, 1600); // a porta começa a subir: a página já vai entrando
    setTimeout(abrir, 2450);
    $('#porta').addEventListener('click', abrir);
  }

  render();
  aoRolar();
})();
