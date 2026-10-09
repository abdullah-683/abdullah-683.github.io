(() => {
  const R = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = id => document.getElementById(id);

  /* ---------- Data ---------- */
  const G = {
    social: { n: 'Social', c: '#C2416B' },
    ads:    { n: 'Ads', c: '#4453C7' },
    web:    { n: 'Web analytics', c: '#1F86C2' },
    crm:    { n: 'CRM and automation', c: '#0E7A75' },
    scrape: { n: 'Scraping', c: '#7A4FC2' }
  };

  const SRC = [
    ['Meta Graph API', 'social', 'Facebook and Instagram page and post performance, including audience demographics.'],
    ['Metricool', 'social', 'Social media analytics data.'],
    ['Meta Ads', 'ads', 'Campaign and ad performance across the brand portfolio.'],
    ['LinkedIn Ads', 'ads', 'Campaign and ad performance for B2B channels.'],
    ['Google Analytics 4', 'web', 'Web analytics event data, modelled in BigQuery SQL.'],
    ['Search Console', 'web', 'Search impressions, clicks, and CTR for weekly performance reports.'],
    ['Salesforce', 'crm', 'CRM data, with models optimised to cut query cost and dashboard load time.'],
    ['Pardot', 'crm', 'Marketing automation and prospect data.'],
    ['Selenium scrapers', 'scrape', 'Custom scrapers for platforms with no usable API.']
  ];

  const K = {
    lang:  { n: 'Languages', c: '#4453C7' },
    cloud: { n: 'Cloud and warehouse', c: '#0E7A75' },
    bi:    { n: 'BI and reporting', c: '#1F86C2' },
    src:   { n: 'Data sources', c: '#C2416B' },
    prac:  { n: 'Practice', c: '#7A4FC2' }
  };

  // Edit the third value of each entry to describe real work you've done with that skill.
  const SK = [
    ['Python', 'lang', 'Runs 60–70+ daily ETL jobs with pandas and requests, plus a retry wrapper with parallel execution and per-script logging.'],
    ['SQL', 'lang', 'BigQuery SQL models behind about 40 dashboards, and health views that flag stale tables and failed runs.'],
    ['pandas', 'lang', 'Data cleaning and dtype and schema alignment before every load.'],
    ['Apps Script', 'lang', 'Automated finance reporting in Google Sheets.'],
    ['PowerShell', 'lang', 'Scripting and automation alongside the Python jobs.'],
    ['BigQuery', 'cloud', 'The warehouse every pipeline lands in, covering modelling, health views, and query cost tuning.'],
    ['Cloud Storage', 'cloud', 'Storage layer within the Google Cloud pipeline stack.'],
    ['Compute VMs', 'cloud', 'Hosts for the scheduled ingestion jobs.'],
    ['Looker Studio', 'bi', 'About 40 dashboards for sales, marketing, and finance, using blends, calculated fields, and row-level security.'],
    ['Power BI', 'bi', 'Dashboard and report development.'],
    ['Google Sheets', 'bi', 'Automated finance reporting built with Apps Script.'],
    ['Meta APIs', 'src', 'Graph and Marketing API pipelines for page, post, audience, and ad data.'],
    ['LinkedIn Ads API', 'src', 'Campaign performance ingestion.'],
    ['GA4', 'src', 'Event data export and modelling in BigQuery.'],
    ['Search Console', 'src', 'Search performance for weekly reporting.'],
    ['Salesforce', 'src', 'CRM ingestion and data model optimisation.'],
    ['Pardot', 'src', 'Marketing automation data.'],
    ['Metricool', 'src', 'Social analytics ingestion.'],
    ['Selenium', 'src', 'Scrapers for platforms with no usable API.'],
    ['ETL design', 'prac', 'Repeatable pipelines that replaced manual campaign reporting.'],
    ['Schema management', 'prac', "Schema-locked loads so upstream changes can't corrupt tables."],
    ['OAuth token lifecycle', 'prac', 'Keeping long-running API connections authenticated across platforms.'],
    ['Scheduling and retries', 'prac', 'Retry orchestration across 60–70+ daily jobs.'],
    ['Git and GitLab', 'prac', 'Version control for the pipeline codebase.']
  ];
  const skColor = n => { const s = SK.find(x => x[0] === n); return s ? K[s[1]].c : '#4F6174'; };

  /* ---------- Job board ---------- */
  $('lg').innerHTML = Object.values(G).map(g => `<span style="--c:${g.c}"><i></i>${g.n}</span>`).join('');

  const N = 64, cells = [], state = new Array(N).fill(0); // 0 pending, 1 running, 2 loaded
  const grid = $('grid'), ctr = $('ctr'), log = $('log');
  const JOBS = ['meta_graph_posts','metricool_posts','meta_ads_insights','linkedin_ads','ga4_events','gsc_queries','salesforce_opps','pardot_prospects','selenium_scrape'];
  const WHY = ['token expired', 'API timeout', 'rate limited'];
  const name = i => JOBS[i % 9] + '_b' + (1 + Math.floor(i / 9) % 5);
  let done = 0, lines = [], timer, runId = 0;

  const L = t => {
    const d = new Date();
    lines.push(String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0') + '  ' + t);
    if (lines.length > 4) lines.shift();
    log.innerHTML = lines.join('<br>');
  };
  const update = () => ctr.textContent = done + ' of ' + N + ' loaded';

  function finish(i) {
    if (state[i] !== 2) { state[i] = 2; done++; }
    cells[i].className = 'ok'; update();
    if (done === N) {
      L('all tables fresh, health view clear');
      if (!R) { clearTimeout(timer); timer = setTimeout(start, 6000); }
    }
  }
  function retry(i, why) {
    if (state[i] === 2) { done--; update(); }
    state[i] = 1; cells[i].className = 'retry';
    L(name(i) + ' ' + why + ', retry 1 of 3');
    setTimeout(() => { cells[i].className = 'run'; setTimeout(() => { finish(i); L(name(i) + ' loaded on retry'); }, 600); }, 1100);
  }
  function job(i) {
    state[i] = 1; cells[i].className = 'run';
    setTimeout(() => {
      if (Math.random() < 0.07) retry(i, WHY[Math.floor(Math.random() * 3)]);
      else { finish(i); if (Math.random() < 0.2) L(name(i) + ' loaded'); }
    }, 450 + Math.random() * 900);
  }
  for (let i = 0; i < N; i++) {
    const s = document.createElement('span');
    s.style.setProperty('--c', G[SRC[i % 9][1]].c);
    s.onclick = () => { if (state[i] === 2) retry(i, 'forced failure'); };
    grid.appendChild(s); cells.push(s);
  }
  function start() {
    const id = ++runId;
    done = 0; state.fill(0); lines = [];
    cells.forEach(c => c.className = ''); update();
    L('run started, ' + N + ' jobs queued');
    [...Array(N).keys()].sort(() => Math.random() - 0.5)
      .forEach((i, k) => setTimeout(() => { if (id === runId) job(i); }, k * 120));
  }
  $('brk').onclick = () => {
    const ok = state.map((s, i) => s === 2 ? i : -1).filter(i => i >= 0);
    if (!ok.length) { L('no finished jobs yet, wait a moment'); return; }
    retry(ok[Math.floor(Math.random() * ok.length)], 'forced failure');
  };
  if (R) { cells.forEach((c, i) => { c.className = 'ok'; state[i] = 2; }); done = N; update(); L('all tables fresh, health view clear'); }
  else start();

  /* ---------- Tool strip ---------- */
  const chips = SK.map(([n, k]) => `<span class="chip" style="--c:${K[k].c}">${n}</span>`).join('');
  $('tr').innerHTML = chips + '<span aria-hidden="true" style="display:contents">' + chips + '</span>';

  /* ---------- Pipeline map ---------- */
  const pl = $('pl'), sd = $('sd');
  let s = '';
  SRC.forEach(([n, g], i) => {
    const y = 22 + i * 36, c = G[g].c, d = `M170 ${y} C 240 ${y} 240 165 300 165`;
    s += `<path class="ln" data-i="${i}" style="--c:${c}" d="${d}"/>`;
    if (!R) for (let k = 0; k < 2; k++)
      s += `<circle class="dt" data-i="${i}" r="3.5" fill="${c}"><animateMotion dur="${(2.4 + Math.random() * 1.6).toFixed(1)}s" begin="-${(Math.random() * 3).toFixed(1)}s" repeatCount="indefinite" path="${d}"/></circle>`;
    s += `<g class="src" data-i="${i}" tabindex="0" role="button" aria-label="${n}"><text x="150" y="${y + 4}" text-anchor="end" font-size="13" fill="#13233A">${n}</text><circle class="k" cx="162" cy="${y}" r="6" fill="${c}"/></g>`;
  });
  [['Sales', 85], ['Marketing', 165], ['Finance', 245]].forEach(([n, y]) => {
    const d = `M420 165 C 480 165 480 ${y} 535 ${y}`;
    s += `<path class="ln keep" style="--c:#13233A" d="${d}"/>`;
    if (!R) for (let k = 0; k < 2; k++)
      s += `<circle class="dt keep" r="3" fill="#13233A"><animateMotion dur="${(2 + Math.random()).toFixed(1)}s" begin="-${(Math.random() * 2).toFixed(1)}s" repeatCount="indefinite" path="${d}"/></circle>`;
    s += `<rect x="535" y="${y - 16}" width="135" height="32" rx="16" fill="#fff" stroke="#D3DCE4"/><text x="602" y="${y + 4}" text-anchor="middle" font-size="13" fill="#13233A">${n}</text>`;
  });
  s += `<rect x="300" y="133" width="120" height="64" rx="12" fill="#13233A"/>
        <text x="360" y="162" text-anchor="middle" font-size="15" font-weight="500" fill="#fff">BigQuery</text>
        <text x="360" y="182" text-anchor="middle" font-size="11.5" fill="#A9B8C8">health-checked</text>
        <text x="602" y="52" text-anchor="middle" font-size="12" fill="#4F6174">Looker Studio</text>`;
  pl.innerHTML = s;

  const EMPTY = '<p>Select a source on the map to trace its data.</p>';
  sd.innerHTML = EMPTY;
  let cur = -1;
  function pick(i) {
    if (cur === i) {
      cur = -1; pl.classList.remove('f');
      pl.querySelectorAll('.on').forEach(e => e.classList.remove('on'));
      sd.innerHTML = EMPTY; return;
    }
    cur = i; pl.classList.add('f');
    pl.querySelectorAll('[data-i]').forEach(e => e.classList.toggle('on', +e.dataset.i === i));
    const [n, g, d] = SRC[i];
    sd.innerHTML = `<span class="chip" style="--c:${G[g].c}">${G[g].n}</span><h3>${n}</h3><p>${d}</p>`;
  }
  pl.querySelectorAll('.src').forEach(g => {
    const i = +g.dataset.i;
    g.onclick = () => pick(i);
    g.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(i); } };
  });

  /* ---------- Skills ---------- */
  document.querySelectorAll('.tags').forEach(t =>
    t.innerHTML = t.dataset.tags.split(',').map(k => `<span class="tg" data-k="${k}" style="--c:${skColor(k)}">${k}</span>`).join(''));

  const flt = $('flt'), ck = $('ck'), ev = $('ev');
  function select(n) {
    ck.querySelectorAll('.chip').forEach(b => b.setAttribute('aria-pressed', b.textContent === n));
    const [nm, k, e] = SK.find(x => x[0] === n);
    ev.innerHTML = `<span class="chip" style="--c:${K[k].c}">${K[k].n}</span><h3>${nm}</h3><p>${e}</p>`;
    document.querySelectorAll('.tg').forEach(t => t.classList.toggle('hit', t.dataset.k === n));
  }
  function render(cat) {
    flt.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === cat));
    const list = SK.filter(x => cat === 'all' || x[1] === cat);
    ck.innerHTML = '';
    list.forEach(([n, k], j) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chip';
      b.style.setProperty('--c', K[k].c);
      b.style.animationDelay = (j * 30) + 'ms';
      b.textContent = n; b.setAttribute('aria-pressed', 'false');
      b.onclick = () => select(n);
      ck.appendChild(b);
    });
    select(list[0][0]);
  }
  [['all', 'All skills'], ...Object.entries(K).map(([k, v]) => [k, v.n])].forEach(([k, n]) => {
    const b = document.createElement('button');
    b.type = 'button'; b.dataset.k = k; b.textContent = n;
    b.onclick = () => render(k);
    flt.appendChild(b);
  });
  render('all');

  /* ---------- Count-up and scroll reveal ---------- */
  function countUp() {
    document.querySelectorAll('#stats b').forEach(b => {
      const to = +b.dataset.to, sx = b.dataset.s, t0 = performance.now();
      const step = t => {
        const p = Math.min(1, (t - t0) / 1200);
        b.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + sx;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
  if (!R && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        if (e.target.id === 'stats') countUp();
        io.unobserve(e.target);
      }
    }), { threshold: 0.12 });
    document.querySelectorAll('.st section').forEach(x => { x.classList.add('rv'); io.observe(x); });
    io.observe($('stats'));
  }

  /* ---------- Copy email ---------- */
  $('cp').onclick = async () => {
    try { await navigator.clipboard.writeText('abdullahjamshed683@gmail.com'); $('cpm').textContent = 'Email copied'; }
    catch (e) { $('cpm').textContent = "Couldn't copy. Select the address above instead."; }
  };
})();