
(function(){
  const m = document.getElementById('privacy-modal');
  if (!m) return;
  m.addEventListener('click', () => m.classList.remove('open'));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') m.classList.remove('open'); });
})();



// ── Live spend ticker ─────────────────────────────────────
(function(){
  const body = document.getElementById('term-body');
  if (!body) return;

  const teams = ['acme-prod', 'support-bot', 'ingest-pipe', 'sales-co', 'dev/jane', 'agent-7', 'eval-runner', 'cron/q'];
  const models = [
    { name: 'opus-4.5',    base: 0.42 },
    { name: 'sonnet-4.5',  base: 0.08 },
    { name: 'haiku-4.5',   base: 0.012 },
    { name: 'gpt-5',       base: 0.31 },
    { name: 'gemini-2.5',  base: 0.07 },
    { name: 'mistral-l',   base: 0.04 },
  ];

  function fmtTime(d) {
    const pad = n => String(n).padStart(2,'0');
    return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
  }
  function rand(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
  function fmtMoney(n) {
    if (n < 0.01) return '$' + n.toFixed(4);
    if (n < 1) return '$' + n.toFixed(3);
    return '$' + n.toFixed(2);
  }

  let lineCount = 0;
  let totalSpend = 4.12;
  let saved = 38420;
  let killed = 2;

  function addLine() {
    const t = new Date();
    const model = rand(models);
    const team = rand(teams);
    const tokens = Math.floor(Math.random() * 80000) + 800;
    const cost = (tokens / 1000) * model.base * (0.8 + Math.random()*0.5);
    const isWarn = Math.random() < 0.09;
    const isKill = Math.random() < 0.03;

    const line = document.createElement('div');
    line.className = 'term-line' + (isWarn ? ' warn' : '') + (isKill ? ' kill' : '');
    const action = isKill ? 'KILL · loop · cap hit' : '';
    line.innerHTML =
      `<span class="t">${fmtTime(t)}</span>` +
      `<span class="who">${team} · ${model.name} · ${tokens.toLocaleString()} tok${isKill ? ' · '+action : ''}</span>` +
      `<span class="cost">${fmtMoney(cost)}</span>`;
    body.appendChild(line);
    lineCount++;

    totalSpend += (Math.random() - 0.45) * 0.4;
    if (totalSpend < 1.2) totalSpend = 1.2;
    if (totalSpend > 9.6) totalSpend = 9.6;
    saved += Math.random() * 24;
    if (isKill) killed++;

    document.getElementById('spend-min').textContent = '$' + totalSpend.toFixed(2);
    document.getElementById('saved').textContent = '$' + Math.round(saved).toLocaleString();
    document.getElementById('killed').textContent = String(killed).padStart(2, '0');

    // Trim
    while (body.children.length > 26) body.removeChild(body.firstChild);
  }

  // Seed
  for (let i = 0; i < 16; i++) addLine();
  setInterval(addLine, 900);
})();
