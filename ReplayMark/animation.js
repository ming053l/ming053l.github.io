(() => {
  'use strict';
  const root = document.getElementById('replay-animation');
  if (!root) return;
  const words = ['the', 'model', 'left', 'a', 'clear', 'trace', 'that', 'can', 'be', 'checked', 'again', 'today'];
  // An illustrative confidence-based commit order, not a measured decoding trace.
  const order = [1, 5, 9, 0, 6, 3, 10, 2, 8, 4, 11, 7];
  const durations = [4000, 6000, 3000, 7000, 5000];
  const starts = durations.map((_, i) => durations.slice(0, i).reduce((a, b) => a + b, 0));
  const total = durations.reduce((a, b) => a + b, 0);
  const captions = [
    'Hide different parts of the prefix. Select positions with two viable response directions before consulting the key.',
    'Draw candidates from the live distribution and favor the keyed response. Keep the reference decoder’s commit order.',
    'Send the finished text. The verifier receives no hidden generation trace or rejected samples.',
    'Re-mask the block and replay the same checkpoint. Recover response directions and compare them with the key.',
    'This toy example has 11 matches out of 12: p = 13 / 4096 ≈ 0.003174, below a 1% threshold.'
  ];
  const generation = document.getElementById('generation-tokens');
  const verification = document.getElementById('verification-tokens');
  for (const container of [generation, verification]) {
    words.forEach(() => { const token = document.createElement('span'); token.className = 'animation-token'; token.textContent = '[M]'; container.appendChild(token); });
  }
  const genTokens = [...generation.children], verTokens = [...verification.children];
  const buttons = [...root.querySelectorAll('[data-phase]')];
  const play = document.getElementById('animation-play');
  const progress = document.getElementById('animation-progress');
  const providerAction = document.getElementById('provider-action');
  const generationStatus = document.getElementById('generation-status');
  const verifierAction = document.getElementById('verifier-action');
  const verifierDetail = document.getElementById('verifier-detail');
  const verificationStatus = document.getElementById('verification-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  let manualPause = reducedMotion.matches || saveData;
  let elapsed = manualPause ? starts[4] : 0;
  let inView = false, timer = null, lastTick = 0, lastState = '';
  function render() {
    let phase = starts.findIndex((start, i) => elapsed >= start && elapsed < start + durations[i]);
    if (phase < 0) phase = 4;
    const fraction = Math.max(0, Math.min(1, (elapsed - starts[phase]) / durations[phase]));
    const count = Math.min(12, Math.floor(fraction * 14));
    progress.style.transform = `scaleX(${elapsed / total})`;
    const state = `${phase}:${count}`;
    if (lastState === state) return;
    lastState = state;
    root.dataset.phase = String(phase);
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === phase)));
    document.getElementById('animation-caption').textContent = captions[phase];
    genTokens.forEach((token, i) => {
      const written = phase > 1 || (phase === 1 && order.indexOf(i) < count);
      token.textContent = written ? words[i] : '[M]';
      token.className = 'animation-token' + (written ? ' written' : '') + (phase === 1 && order[count - 1] === i ? ' just-written' : '');
    });
    verTokens.forEach((token, i) => {
      const checked = phase === 4 || (phase === 3 && i < count);
      token.textContent = checked || phase === 2 ? words[i] : phase < 2 ? '· · ·' : '[M]';
      token.className = 'animation-token' + (checked ? ' replayed' + (i === 7 ? ' mismatch' : '') : phase === 2 ? ' received' : '');
    });
    providerAction.textContent = phase === 0 ? 'Compare responses to two hidden-prefix probes' : phase === 1 ? 'Key K chooses a response direction; sample and commit' : 'The finished text carries the response signal';
    generationStatus.textContent = phase === 0 ? 'Current block masked. Both response directions must be viable.' : phase === 1 ? `${count} / 12 illustrative positions committed. Schedule unchanged.` : 'Generation complete. Only the text is passed to the verifier.';
    verifierAction.textContent = phase < 2 ? 'Waiting for finished text' : phase === 2 ? 'Text received' : phase === 3 ? 'Re-mask → query → compare' : '11 / 12 keyed matches';
    verifierDetail.textContent = phase < 2 ? 'No generation trace is sent.' : phase === 2 ? 'Reconstruct the original probe conditions.' : phase === 3 ? 'Same weights. Same probe construction.' : 'Exact binomial p = 0.003174';
    verificationStatus.textContent = phase < 2 ? 'The verifier will rebuild the same probes.' : phase === 2 ? 'Next, mask the current block and suffix for replay.' : phase === 3 ? `${count} / 12 responses replayed. ✓ Match   × Mismatch` : 'Toy result: p ≤ 0.01. The checkpoint-consistent signal is detected.';
  }
  function tick() {
    const now = performance.now();
    elapsed = (elapsed + Math.min(now - lastTick, 250)) % total;
    lastTick = now;
    render();
  }
  function sync() {
    const running = !manualPause && inView && !document.hidden;
    if (timer !== null && !running) { clearInterval(timer); timer = null; }
    if (timer === null && running) { lastTick = performance.now(); timer = setInterval(tick, 90); }
    root.classList.toggle('is-paused', !running);
    play.textContent = manualPause ? '▶ Play' : 'Ⅱ Pause';
    play.setAttribute('aria-label', manualPause ? 'Play the animation' : 'Pause the animation');
  }
  play.addEventListener('click', () => { manualPause = !manualPause; sync(); });
  document.getElementById('animation-restart').addEventListener('click', () => { elapsed = 0; lastState = ''; manualPause = false; render(); sync(); });
  buttons.forEach((button, phase) => button.addEventListener('click', () => { elapsed = starts[phase] + (phase === 1 || phase === 3 ? durations[phase] * 0.9 : 0); lastState = ''; manualPause = true; render(); sync(); }));
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', event => { if (event.matches) { manualPause = true; sync(); } });
  root.hidden = false;
  document.querySelector('.diagram-details').open = false;
  render(); sync();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; sync(); }, {threshold: 0.1});
    observer.observe(root);
  } else { inView = true; sync(); }
})();
