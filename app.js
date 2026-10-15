(() => {
  const works = window.WORKS;
  const $ = (id) => document.getElementById(id);
  const grid = $('grid');
  const dialog = $('detail');
  let filter = 'すべて';
  let order = 'new';

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const imgSrc = (w) => (w.placeholder ? null : `img/${w.id}.webp`);
  const fmt = (d) => d.replace(/-/g, '/');
  const days = (w) => Math.round((new Date(w.period[1]) - new Date(w.period[0])) / 864e5) + 1;
  const periodText = (w) => (w.period[0] === w.period[1] ? fmt(w.period[0]) : `${fmt(w.period[0])} 〜 ${fmt(w.period[1])}`);
  // 一覧用の短い表記（同じ年なら終わりの年を省く）
  const shortPeriod = (w) => {
    const [a, b] = w.period;
    if (a === b) return fmt(a);
    return `${fmt(a)}〜${a.slice(0, 4) === b.slice(0, 4) ? fmt(b.slice(5)) : fmt(b)}`;
  };
  const yen = (n) => `${n.toLocaleString('ja-JP')}円`;
  const costText = (c) => (c.yen != null ? `${c.approx ? '約' : ''}${yen(c.yen)}${c.plus ? '以上' : ''}` : c.perUnit);
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

  $('sort').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    order = b.dataset.order;
    renderGrid();
  });

  function renderGrid() {
    const list = (filter === 'すべて' ? works : works.filter((w) => w.category === filter)).slice()
      .sort((x, y) => (x.period[0] + x.period[1]).localeCompare(y.period[0] + y.period[1]) * (order === 'new' ? -1 : 1));
    $('count').textContent = `${list.length} 件`;
    $('filters').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.cat === filter));
    $('sort').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.order === order));
    grid.innerHTML = list.map((w) => `
      <button type="button" class="card" data-id="${esc(w.id)}">
        <div class="thumb">${media(w)}</div>
        <h3>${esc(w.title)}</h3>
        <p class="cat">${esc(w.category)}</p>
        <p class="period">${shortPeriod(w)}<span>（${days(w)}日間）</span></p>
        <p class="cost${w.cost ? '' : ' none'}">API費用 ${w.cost ? esc(costText(w.cost)) : '記録なし'}</p>
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
    $('d-meta').textContent = w.category;
    $('d-title').textContent = w.title;
    $('d-summary').textContent = w.summary;
    $('d-facts').innerHTML = `
      <div><dt>制作期間</dt><dd>${periodText(w)}<span>${days(w)}日間</span></dd></div>
      <div><dt>API費用</dt><dd>${w.cost ? `${esc(costText(w.cost))}<span>${esc(w.cost.note)}</span>` : '<span>記録なし</span>'}</dd></div>`;
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
