// small, readable JS: filters drawer + sort + demo cart

const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

/* ===== Sort menu ===== */
(() => {
  const btn = qs('.sort-btn');
  const menu = qs('.sort-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.hasAttribute('hidden') ? 'true' : 'false';
    btn.setAttribute('aria-expanded', open);
    if (menu.hasAttribute('hidden')) menu.removeAttribute('hidden');
    else menu.setAttribute('hidden', '');
  });

  menu.addEventListener('click', (e) => {
    if (e.target.matches('button[data-sort]')) {
      const how = e.target.dataset.sort;
      sortGrid(how);
      menu.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
      btn.firstChild && (btn.firstChild.textContent = btn.firstChild.textContent); // no-op to keep structure simple
    }
  });

  function sortGrid(how) {
    const grid = qs('#grid');
    const cards = qsa('.card', grid);
    const by = {
      'price-asc': (a, b) => (+a.dataset.price) - (+b.dataset.price),
      'price-desc': (a, b) => (+b.dataset.price) - (+a.dataset.price),
      'name-asc': (a, b) => a.dataset.name.localeCompare(b.dataset.name),
    }[how] || (() => 0);

    cards.sort(by).forEach(c => grid.appendChild(c));
  }
})();

/* ===== Drawer (mobile filters) ===== */
(() => {
  const openBtn = qs('.filter-open');
  const drawer = qs('#filter-drawer');
  const overlay = qs('[data-overlay]');
  const closeBtn = qs('.drawer-close');
  const desktopForm = qs('#filter-form');
  const drawerForm = qs('.drawer-form');

  if (!openBtn || !drawer) return;

  // clone desktop form into drawer so both look identical
  if (desktopForm && drawerForm && !drawerForm.childElementCount) {
    drawerForm.appendChild(desktopForm.cloneNode(true));
  }

  const open = () => {
    drawer.dataset.open = 'true';
    drawer.setAttribute('aria-hidden', 'false');
    overlay.hidden = false;
  };
  const close = () => {
    drawer.dataset.open = 'false';
    drawer.setAttribute('aria-hidden', 'true');
    overlay.hidden = true;
  };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);

  qs('.drawer-clear')?.addEventListener('click', () => {
    qsa('input[type="checkbox"]', drawer).forEach(cb => cb.checked = false);
  });
  qs('.drawer-save')?.addEventListener('click', close);
})();

/* ===== Fake add-to-cart for the black bar + hero button ===== */
(() => {
  const toast = (msg) => {
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = `
      position:fixed;right:16px;top:16px;z-index:50;
      background:#111;color:#fff;padding:.6rem .8rem;border-radius:4px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  };

  qsa('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => toast('Added to cart'));
  });
  qsa('.card .bar').forEach(bar => {
    bar.addEventListener('click', () => toast('Added to cart'));
  });
})();
