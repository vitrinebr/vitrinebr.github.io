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

  render();
})();
