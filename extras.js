(() => {
  const R = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover)').matches;

  /* ---------- Sticky nav: shadow, progress bar, active link ---------- */
  const topbar = document.querySelector('.topbar');
  const prog = document.querySelector('.prog');
  const links = [...document.querySelectorAll('.topbar nav ul a')];
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    topbar.classList.toggle('scrolled', y > 8);
    prog.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });
  }

  /* ---------- 3D tilt ---------- */
  function tilt(el, max) {
    if (R || !canHover) return;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${(x * max * 2).toFixed(2)}deg) rotateX(${(-y * max * 2).toFixed(2)}deg)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  }
  tilt(document.getElementById('portrait'), 8);

  /* ---------- Dashboard preview illustrations ---------- */
  function frame(body, label) {
    return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
      <rect width="320" height="200" fill="#fff"/><rect width="320" height="22" fill="#F2F5F7"/>
      <circle cx="12" cy="11" r="3" fill="#D3DCE4"/><circle cx="22" cy="11" r="3" fill="#D3DCE4"/><circle cx="32" cy="11" r="3" fill="#D3DCE4"/>
      <rect x="46" y="8" width="70" height="6" rx="3" fill="#13233A" fill-opacity=".7"/>${body}</svg>`;
  }
  function mock(m, c, label) {
    let b = '';
    if (m === 'social') {
      for (let k = 0; k < 3; k++) {
        const x = 12 + k * 102;
        b += `<rect x="${x}" y="32" width="94" height="36" rx="6" fill="${c}" fill-opacity=".1"/>
              <rect x="${x + 8}" y="40" width="40" height="5" rx="2.5" fill="#4F6174" fill-opacity=".5"/>
              <rect x="${x + 8}" y="51" width="${30 + k * 10}" height="9" rx="3" fill="${c}"/>`;
      }
      const v = [150, 140, 146, 122, 128, 110, 118, 98, 104, 90, 96];
      const pts = v.map((y, i) => [22 + i * 27.6, y]);
      const line = pts.map(p => p.join(',')).join(' ');
      b += `<rect x="12" y="78" width="296" height="110" rx="6" fill="#F2F5F7"/>
            <path d="M${pts[0][0]},180 L${line.replace(/ /g, ' L')} L${pts[10][0]},180 Z" fill="${c}" fill-opacity=".15"/>
            <polyline points="${line}" fill="none" stroke="${c}" stroke-width="2.5" stroke-linejoin="round"/>
            <polyline points="${v.map((y, i) => [22 + i * 27.6, y + 22].join(',')).join(' ')}" fill="none" stroke="#13233A" stroke-opacity=".3" stroke-width="1.5" stroke-dasharray="4 4"/>`;
    }
    if (m === 'health') {
      const amber = [17, 44, 61];
      for (let i = 0; i < 84; i++) {
        const x = 12 + (i % 14) * 13, y = 32 + Math.floor(i / 14) * 13, a = amber.includes(i);
        b += `<rect x="${x}" y="${y}" width="10" height="10" rx="2" fill="${a ? '#C98A12' : c}" fill-opacity="${a ? 1 : .85}"/>`;
      }
      for (let r = 0; r < 6; r++) {
        const y = 36 + r * 13;
        b += `<circle cx="212" cy="${y}" r="3.5" fill="${r === 2 ? '#C98A12' : c}"/>
              <rect x="222" y="${y - 3}" width="${50 + (r * 17) % 36}" height="6" rx="3" fill="#13233A" fill-opacity=".25"/>`;
      }
      b += `<rect x="12" y="118" width="296" height="70" rx="6" fill="#F2F5F7"/>`;
      [20,28,24,34,30,40,22,36,44,30,26,38,46,32,28,42,36,48,40,34].forEach((v, i) => {
        b += `<rect x="${22 + i * 14.2}" y="${180 - v}" width="9" height="${v}" rx="2" fill="${c}" fill-opacity=".45"/>`;
      });
    }
    if (m === 'finance') {
      b += `<rect x="12" y="32" width="190" height="108" rx="6" fill="#F2F5F7"/>`;
      [50, 64, 58, 72, 66, 80, 74, 88].forEach((v, i) => {
        const x = 24 + i * 22;
        b += `<rect x="${x}" y="${130 - v}" width="8" height="${v}" rx="2" fill="${c}"/>
              <rect x="${x + 9}" y="${130 - v * .7}" width="8" height="${v * .7}" rx="2" fill="#13233A" fill-opacity=".25"/>`;
      });
      b += `<circle cx="258" cy="84" r="30" fill="none" stroke="#13233A" stroke-opacity=".15" stroke-width="12"/>
            <circle cx="258" cy="84" r="30" fill="none" stroke="${c}" stroke-width="12" stroke-dasharray="125 190" transform="rotate(-90 258 84)"/>`;
      for (let r = 0; r < 4; r++) {
        const y = 152 + r * 10;
        b += `<rect x="12" y="${y}" width="296" height="1" fill="#D3DCE4"/>
              <rect x="16" y="${y + 3}" width="${60 + r * 14}" height="4" rx="2" fill="#4F6174" fill-opacity=".4"/>
              <rect x="260" y="${y + 3}" width="44" height="4" rx="2" fill="${c}" fill-opacity=".7"/>`;
      }
    }
    if (m === 'funnel') {
      [280, 226, 174, 122, 72].forEach((w, k) => {
        const y = 34 + k * 31;
        b += `<rect x="${160 - w / 2}" y="${y}" width="${w}" height="24" rx="5" fill="${c}" fill-opacity="${1 - k * .17}"/>
              <rect x="146" y="${y + 9}" width="28" height="6" rx="3" fill="#fff" fill-opacity=".85"/>`;
      });
    }
    return frame(b, label);
  }

  /* ---------- Work items ----------
     To use a real (sanitized) screenshot, set img to a path, e.g. img: 'images/social.png' */
  const WORK = [
    { t: 'Social performance reporting', s: 'Meta Graph API to Looker Studio', m: 'social', c: '#C2416B', img: null,
      d: 'Facebook and Instagram page, post, and audience demographic data pulled from the Meta Graph API, loaded into BigQuery, and reported across a portfolio of four to six brands.',
      tags: ['Meta APIs', 'Python', 'BigQuery', 'Looker Studio'] },
    { t: 'Pipeline health monitor', s: 'BigQuery health views', m: 'health', c: '#0E7A75', img: null,
      d: 'Health views in BigQuery that flag stale tables and failed runs across 60–70+ daily jobs, backed by a retry wrapper with per-script logging and parallel execution.',
      tags: ['BigQuery', 'SQL', 'Python', 'Scheduling and retries'] },
    { t: 'Automated finance reporting', s: 'Google Sheets and Apps Script', m: 'finance', c: '#1F86C2', img: null,
      d: 'Finance reports in Google Sheets that build themselves with Apps Script instead of being assembled by hand.',
      tags: ['Apps Script', 'Google Sheets'] },
    { t: 'Sales account dashboards', s: 'Salesforce with row-level security', m: 'funnel', c: '#4453C7', img: null,
      d: 'Salesforce dashboards in Looker Studio with row-level security, so each stakeholder sees only their own accounts. Data models were optimised to cut query cost and load time.',
      tags: ['Salesforce', 'Looker Studio', 'SQL'] }
  ];
  const visual = w => w.img ? `<img src="${w.img}" alt="${w.t} dashboard screenshot" loading="lazy">` : mock(w.m, w.c, w.t);

  /* ---------- Gallery and lightbox ---------- */
  const gal = document.getElementById('gal');
  if (!gal) return;
  const lb = document.getElementById('lb');
  let cur = 0;

  function show(i) {
    cur = (i + WORK.length) % WORK.length;
    const w = WORK[cur];
    document.getElementById('lbVis').innerHTML = visual(w);
    document.getElementById('lbTitle').textContent = w.t;
    document.getElementById('lbDesc').textContent = w.d;
    document.getElementById('lbTags').innerHTML = w.tags.map(t => `<span class="tg" style="--c:${w.c}">${t}</span>`).join('');
    if (!lb.open) lb.showModal();
  }

  WORK.forEach((w, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'shot';
    b.style.setProperty('--c', w.c);
    b.innerHTML = `<div class="vis">${visual(w)}</div><div class="cap"><b>${w.t}</b><span>${w.s}</span></div><span class="open">View</span>`;
    b.onclick = () => show(i);
    tilt(b, 5);
    gal.appendChild(b);
  });

  document.getElementById('lbClose').onclick = () => lb.close();
  document.getElementById('lbPrev').onclick = () => show(cur - 1);
  document.getElementById('lbNext').onclick = () => show(cur + 1);
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') show(cur + 1);
    if (e.key === 'ArrowLeft') show(cur - 1);
  });
})();