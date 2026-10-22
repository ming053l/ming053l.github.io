(() => {
  'use strict';
  const switcher = document.querySelector('.model-switch');
  const modelButtons = [...switcher.querySelectorAll('button')];
  const tables = {llada: document.getElementById('llada-results'), dream: document.getElementById('dream-results')};
  const caption = document.getElementById('model-caption');
  tables.dream.hidden = true;
  tables.dream.querySelector('.model-divider').hidden = true;
  switcher.hidden = false;
  modelButtons.forEach(button => button.addEventListener('click', () => {
    modelButtons.forEach(other => {
      const active = other === button;
      other.classList.toggle('active', active);
      other.setAttribute('aria-pressed', String(active));
      tables[other.dataset.model].hidden = !active;
    });
    caption.textContent = button.textContent;
  }));

  const demo = document.getElementById('evidence-demo');
  const grid = document.getElementById('carrier-grid');
  const initial = Array.from({length: 20}, (_, i) => ![4, 9, 14, 19].includes(i));
  let matches = [...initial];
  // Exact enumeration of Binomial(20, 1/2); all counts fit exactly in a JS number.
  function binomialTail(k) {
    let coefficient = 1, numerator = 0;
    for (let j = 0; j <= 20; j++) {
      if (j >= k) numerator += coefficient;
      coefficient = coefficient * (20 - j) / (j + 1);
    }
    return numerator / 2 ** 20;
  }
  function update() {
    const count = matches.filter(Boolean).length;
    const p = binomialTail(count);
    [...grid.children].forEach((button, i) => {
      button.setAttribute('aria-pressed', String(matches[i]));
      button.setAttribute('aria-label', `Carrier ${i + 1}: ${matches[i] ? 'match' : 'mismatch'}. Click to toggle.`);
      button.querySelector('.carrier-symbol').textContent = matches[i] ? '✓' : '×';
    });
    document.getElementById('match-count').textContent = count;
    document.getElementById('p-value').textContent = p < 0.0001 ? p.toExponential(3) : p.toFixed(6);
    const decision = document.getElementById('decision');
    decision.textContent = p <= 0.01 ? 'Below the 1% threshold' : 'Not below the 1% threshold';
    decision.classList.toggle('not-detected', p > 0.01);
  }
  initial.forEach((_, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'carrier';
    const symbol = document.createElement('span'); symbol.className = 'carrier-symbol'; symbol.setAttribute('aria-hidden', 'true');
    const number = document.createElement('span'); number.className = 'carrier-number'; number.textContent = String(i + 1).padStart(2, '0'); number.setAttribute('aria-hidden', 'true');
    button.append(symbol, number);
    button.addEventListener('click', () => { matches[i] = !matches[i]; update(); });
    grid.appendChild(button);
  });
  document.getElementById('reset-demo').addEventListener('click', () => { matches = [...initial]; update(); });
  update(); demo.hidden = false;

  const copyButton = document.getElementById('copy-citation');
  const status = document.getElementById('copy-status');
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    const code = document.getElementById('bibtex');
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(code.textContent);
      status.textContent = 'BibTeX copied.';
      copyButton.textContent = 'Copied ✓';
      setTimeout(() => { copyButton.textContent = 'Copy BibTeX'; }, 2000);
    } catch {
      const range = document.createRange(); range.selectNodeContents(code);
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      status.textContent = 'Citation selected. Press Ctrl+C or ⌘C to copy.';
    }
  });
})();
