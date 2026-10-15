(() => {
  const works = window.WORKS;
  const $ = (id) => document.getElementById(id);
  const grid = $('grid');
  const dialog = $('detail');
  let filter = 'すべて';

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const imgSrc = (w) => (w.placeholder ? null : `img/${w.id}.webp`);
  const media = (w) => {
    const src = imgSrc(w);
    if (src) return `<img src="${src}" alt="${esc(w.title)} の画面" loading="lazy"${w.video ? ' class="wide"' : ''}>`;
    const p = w.placeholder || {};
    return `<div class="ph"><b>${esc(p.label || w.title)}</b><span>${esc(p.sub || '')}</span></div>`;
  };

  // フィルター
  const cats = ['すべて', ...new Set(works.map((w) => w.category))];
  $('filters').innerHTML = cats.map((c) => `<button type="button" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
  $('filters').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    filter = b.dataset.cat;
    renderGrid();
  });

  function renderGrid() {
    const list = filter === 'すべて' ? works : works.filter((w) => w.category === filter);
    $('count').textContent = `${list.length} 件`;
    $('filters').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.cat === filter));
    grid.innerHTML = list.map((w) => `
      <button type="button" class="card" data-id="${esc(w.id)}">
        <div class="thumb">${media(w)}</div>
        <h3>${esc(w.title)}</h3>
        <p class="cat">${esc(w.category)}</p>
      </button>`).join('');
  }

  grid.addEventListener('click', (e) => {
    const c = e.target.closest('.card');
    if (c) location.hash = c.dataset.id;
  });

  function openDetail(w) {
    $('d-media').innerHTML = w.video
      ? `<video src="${w.video}" poster="${imgSrc(w)}" controls playsinline preload="none"></video>`
      : media(w);
    $('d-meta').textContent = `${w.category} ・ ${w.updated.replace(/-/g, '/')} 更新`;
    $('d-title').textContent = w.title;
    $('d-summary').textContent = w.summary;
    $('d-points').innerHTML = w.points.map((p) => `<li>${esc(p)}</li>`).join('');
    $('d-tech').innerHTML = w.tech.map((t) => `<li>${esc(t)}</li>`).join('');
    const links = [];
    if (w.url) links.push(`<a class="btn primary" href="${w.url}" target="_blank" rel="noopener">開く ↗</a>`);
    if (w.repo && !w.private) links.push(`<a class="btn" href="https://github.com/kyosuke0306/${w.repo}" target="_blank" rel="noopener">GitHub</a>`);
    if (w.private) links.push('<span class="note">非公開リポジトリ</span>');
    $('d-links').innerHTML = links.join('');
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
  }

  // URL の #id で詳細を開く（戻るボタンで閉じられる）
  function route() {
    const w = works.find((x) => x.id === decodeURIComponent(location.hash.slice(1)));
    if (w) openDetail(w);
    else if (dialog.open) dialog.close();
  }
  const closeDetail = () => {
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    if (dialog.open) dialog.close();
  };
  $('close').addEventListener('click', closeDetail);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) closeDetail(); });
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); closeDetail(); });
  dialog.addEventListener('close', () => { const v = dialog.querySelector('video'); if (v) v.pause(); });
  window.addEventListener('hashchange', route);

  renderGrid();
  route();
})();
