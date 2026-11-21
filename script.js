(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const save = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

  // Photos: name.jpg / .jpeg / .png / .webp from /images, first one that exists is shown
  const exts = ['jpg', 'jpeg', 'png', 'webp'];
  const loadPic = (el, name) => {
    const tok = el._t = (el._t || 0) + 1; let i = 0;
    el.classList.remove('ok');
    const next = () => {
      if (i >= exts.length || el._t !== tok) return;
      const src = 'images/' + name + '.' + exts[i++], im = new Image();
      im.onload = () => { if (el._t === tok) { el.style.setProperty('--img', 'url(' + src + ')'); el.classList.add('ok'); } };
      im.onerror = next; im.src = src;
    };
    next();
  };
  $$('.pic[data-img]').forEach(el => loadPic(el, el.dataset.img));

  // Mobile full-screen menu
  const menu = $('#menu'), burger = $('#burger');
  const toggle = o => { menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); burger.textContent = o ? '×' : '☰'; document.body.style.overflow = o ? 'hidden' : ''; };
  burger.onclick = () => toggle(!menu.classList.contains('open'));
  menu.onclick = e => { if (e.target.tagName === 'A') toggle(false); };
  addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });

  // Header turns solid on scroll
  const top = $('#top');
  const onScroll = () => top.classList.toggle('solid', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Scroll reveal with stagger
  $$('.bento').forEach(g => $$('.rv', g).forEach((el, i) => el.style.setProperty('--d', (i % 4) * 0.08 + 's')));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
  $$('.rv').forEach(el => io.observe(el));

  // Menu: hover/tap an item to preview it in the arch
  const prev = $('#prev'), mis = $$('.mi');
  const show = b => { mis.forEach(x => x.classList.toggle('on', x === b)); prev.dataset.e = b.dataset.e; loadPic(prev, b.dataset.img); };
  mis.forEach(b => {
    b.addEventListener('click', () => show(b));
    b.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover)').matches) show(b); });
  });
  show(mis[0]);

  // Reviews: fading quotes with dots
  const qs = $$('.q'), dotsBox = $('#dots'); let qi = 0, qt;
  const dots = qs.map((_, k) => { const d = document.createElement('button'); d.className = 'dot'; d.type = 'button'; d.setAttribute('aria-label', 'Review ' + (k + 1)); d.onclick = () => { showQ(k); auto(); }; dotsBox.appendChild(d); return d; });
  const showQ = i => { qi = (i + qs.length) % qs.length; qs.forEach((q, k) => q.classList.toggle('on', k === qi)); dots.forEach((d, k) => d.classList.toggle('on', k === qi)); };
  const auto = () => { clearInterval(qt); qt = setInterval(() => showQ(qi + 1), 6000); };
  showQ(0); auto();

  // Language (Arabic default) + theme (light default)
  const items = $$('[data-ar]'); items.forEach(e => { e.dataset.en = e.innerHTML; });
  const themeBtn = $('#themeBtn'), langBtn = $('#langBtn'), metaDesc = $('meta[name=description]'), metaTheme = $('meta[name=theme-color]');
  const DD = { en: metaDesc.content, ar: 'هاتن كافيه، مقهى عصري في الرياض. قهوة مختصة وإسبريسو وتيراميسو وكيكة التمر وأكثر. جلسات داخلية وسفري وتوصيل.' };
  const TT = { en: 'Haten Cafe (هاتن كافيه) | Specialty Coffee in Riyadh', ar: 'هاتن كافيه (Haten Cafe) | قهوة مختصة في الرياض' };
  const labels = () => {
    const dark = root.dataset.theme === 'dark', ar = root.lang === 'ar';
    themeBtn.textContent = dark ? '☀' : '☾';
    themeBtn.setAttribute('aria-label', ar ? (dark ? 'الوضع الفاتح' : 'الوضع الداكن') : (dark ? 'Light mode' : 'Dark mode'));
    langBtn.textContent = ar ? 'EN' : 'ع';
    langBtn.setAttribute('aria-label', ar ? 'Switch to English' : 'التبديل إلى العربية');
    burger.setAttribute('aria-label', ar ? 'القائمة' : 'Menu');
  };
  const setTheme = t => { root.dataset.theme = t; metaTheme.content = t === 'dark' ? '#2a211a' : '#E9DCC9'; labels(); save('hc-theme', t); };
  const setLang = l => {
    const ar = l === 'ar';
    root.lang = l; root.dir = ar ? 'rtl' : 'ltr';
    items.forEach(e => { e.innerHTML = ar ? e.dataset.ar : e.dataset.en; });
    document.title = TT[l]; metaDesc.content = DD[l];
    $('#yr').textContent = new Date().getFullYear();
    labels(); save('hc-lang', l);
  };
  themeBtn.onclick = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  langBtn.onclick = () => setLang(root.lang === 'ar' ? 'en' : 'ar');
  setLang(root.lang === 'en' ? 'en' : 'ar'); setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
})();
