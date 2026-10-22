(() => {
  'use strict';
  const parts = ['eyes', 'lips', 'face'];
  const titles = { eyes: 'Eyes', lips: 'Lips', face: 'Blush & face art' };
  const canvas = document.getElementById('portrait');
  const ctx = canvas.getContext('2d');
  const images = new Map();
  const state = { selected: {}, strength: { eyes: 100, lips: 100, face: 100 }, hue: 0, original: false };
  let data, pendingFrame = false, tinted = null;
  const $ = id => document.getElementById(id);
  const asset = file => `assets/${file}`;
  function loadImage(file) {
    if (images.has(file)) return Promise.resolve(images.get(file));
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => { images.set(file, image); resolve(image); };
      image.onerror = () => reject(new Error(`Could not load ${file}`));
      image.src = asset(file);
    });
  }
  function announce(message) { $('status').textContent = message; }
  function requestDraw() {
    if (pendingFrame) return;
    pendingFrame = true;
    requestAnimationFrame(() => { pendingFrame = false; draw(); });
  }
  function hueLayer(file) {
    const key = `${file}:${state.hue}`;
    if (tinted && tinted.key === key) return tinted.canvas;
    const layer = document.createElement('canvas'); layer.width = data.width; layer.height = data.height;
    const lc = layer.getContext('2d', { willReadFrequently: true });
    lc.drawImage(images.get(file), 0, 0);
    const pixels = lc.getImageData(0, 0, data.width, data.height), p = pixels.data;
    // Rotate hue only on the prepared lip layer; the source portrait never changes.
    for (let i = 0; i < p.length; i += 4) {
      if (!p[i + 3]) continue;
      const r = p[i] / 255, g = p[i + 1] / 255, b = p[i + 2] / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
      if (!d) continue;
      const l = (max + min) / 2, sat = d / (1 - Math.abs(2 * l - 1));
      let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h = ((h * 60 + state.hue) % 360 + 360) % 360 / 60;
      const c = (1 - Math.abs(2 * l - 1)) * sat, x = c * (1 - Math.abs(h % 2 - 1)), m = l - c / 2;
      const rgb = h < 1 ? [c,x,0] : h < 2 ? [x,c,0] : h < 3 ? [0,c,x] : h < 4 ? [0,x,c] : h < 5 ? [x,0,c] : [c,0,x];
      p[i] = (rgb[0] + m) * 255; p[i + 1] = (rgb[1] + m) * 255; p[i + 2] = (rgb[2] + m) * 255;
    }
    lc.putImageData(pixels, 0, 0); tinted = { key, canvas: layer }; return layer;
  }
  function paint(target, original = false) {
    target.globalAlpha = 1;
    target.drawImage(images.get(data.source), 0, 0, data.width, data.height);
    if (original) return;
    for (const part of parts) {
      const look = data.looks.find(l => l.id === state.selected[part]);
      if (!look || !state.strength[part]) continue;
      const file = look.parts[part].image;
      target.globalAlpha = state.strength[part] / 100;
      target.drawImage(part === 'lips' && state.hue ? hueLayer(file) : images.get(file), 0, 0);
    }
    target.globalAlpha = 1;
  }
  function draw() { paint(ctx, state.original); }
  function showMix() {
    state.original = false;
    $('compare').setAttribute('aria-pressed', 'false');
    $('compare').innerHTML = '<span aria-hidden="true">◐</span> Show original';
    $('view-label').textContent = 'Your mix';
  }
  function updateControls() {
    for (const part of parts) {
      document.querySelectorAll(`[data-part="${part}"]`).forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.look === state.selected[part]));
      });
      const look = data.looks.find(l => l.id === state.selected[part]);
      $(`${part}-name`).textContent = look ? look.parts[part].label : 'No layer';
      $(`${part}-strength`).value = state.strength[part];
      $(`${part}-strength`).disabled = !look;
      $(`${part}-value`).value = `${state.strength[part]}%`;
    }
    for (const button of document.querySelectorAll('[data-preset]')) {
      const matches = parts.every(part => state.selected[part] === button.dataset.preset && state.strength[part] === 100) && state.hue === 0;
      button.setAttribute('aria-pressed', String(matches));
    }
    $('hue').disabled = state.selected.lips === 'none';
    $('hue').value = state.hue;
    $('hue-value').value = `${state.hue > 0 ? '+' : ''}${state.hue}°`;
  }
  function applyPreset(id) {
    for (const part of parts) { state.selected[part] = id; state.strength[part] = 100; }
    state.hue = 0; showMix(); updateControls(); requestDraw();
    announce(`${data.looks.find(l => l.id === id).label} · Ready to remix`);
  }
  function buildControls() {
    for (const look of data.looks) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'preset';
      button.dataset.preset = look.id; button.setAttribute('aria-pressed', 'false');
      button.innerHTML = `<img src="${asset(look.preview)}" width="120" height="120" alt=""><span>${look.label}</span>`;
      button.addEventListener('click', () => applyPreset(look.id)); $('presets').append(button);
    }
    for (const part of parts) {
      const field = document.createElement('fieldset'); field.className = 'part';
      field.innerHTML = `<legend><span class="part-title">${titles[part]}</span><span class="part-name" id="${part}-name"></span></legend><div class="part-options" id="${part}-options"></div>`;
      $('parts').append(field); const options = $(`${part}-options`);
      for (const look of [null, ...data.looks]) {
        const button = document.createElement('button'); button.type = 'button'; button.className = 'part-option';
        button.dataset.part = part; button.dataset.look = look ? look.id : 'none';
        button.title = look ? look.parts[part].label : `Remove ${titles[part].toLowerCase()}`;
        button.setAttribute('aria-label', button.title); button.setAttribute('aria-pressed', 'false');
        if (look) button.innerHTML = `<img src="${asset(look.parts[part].reference)}" width="44" height="44" alt="">`;
        else { button.classList.add('part-none'); button.innerHTML = '<span aria-hidden="true">∅</span>'; }
        button.addEventListener('click', () => {
          state.selected[part] = button.dataset.look; showMix(); updateControls(); requestDraw();
          announce(`${titles[part]}: ${look ? look.parts[part].label : 'removed'}`);
        });
        options.append(button);
      }
      const strength = document.createElement('div'); strength.className = 'strength';
      strength.innerHTML = `<input type="range" id="${part}-strength" min="0" max="100" value="100" aria-label="${titles[part]} strength" aria-describedby="${part}-value"><output id="${part}-value" for="${part}-strength">100%</output>`;
      options.append(strength);
      $(`${part}-strength`).addEventListener('input', event => {
        state.strength[part] = Number(event.target.value); showMix(); updateControls(); requestDraw();
      });
    }
  }
  async function start() {
    try {
      if (!ctx) throw new Error('Canvas is not available');
      const response = await fetch(asset('manifest.json'));
      if (!response.ok) throw new Error('Palette is not available');
      data = await response.json();
      await Promise.all([loadImage(data.source), ...data.looks.flatMap(look => parts.map(part => loadImage(look.parts[part].image)))]);
      buildControls();
      canvas.hidden = false; $('portrait-fallback').hidden = true;
      for (const id of ['compare','download','reset','shuffle','hue']) $(id).disabled = false;
      $('hue').addEventListener('input', event => {
        state.hue = Number(event.target.value); showMix(); updateControls(); requestDraw();
      });
      $('compare').addEventListener('click', () => {
        state.original = !state.original;
        $('compare').setAttribute('aria-pressed', String(state.original));
        $('compare').innerHTML = state.original ? '<span aria-hidden="true">◐</span> Back to your mix' : '<span aria-hidden="true">◐</span> Show original';
        $('view-label').textContent = state.original ? 'Original' : 'Your mix';
        requestDraw(); announce(state.original ? 'Showing the original portrait' : 'Showing your makeup mix');
      });
      $('reset').addEventListener('click', () => applyPreset('everyday'));
      $('shuffle').addEventListener('click', () => {
        for (const part of parts) {
          const choices = data.looks.filter(look => look.id !== state.selected[part]);
          state.selected[part] = choices[Math.floor(Math.random() * choices.length)].id;
          state.strength[part] = 100;
        }
        state.hue = 0; showMix(); updateControls(); requestDraw(); announce('A fresh mix · Make it yours');
      });
      $('download').addEventListener('click', () => {
        // Export the mix even when the original is being compared on screen.
        const output = document.createElement('canvas'); output.width = data.width; output.height = data.height;
        paint(output.getContext('2d'));
        output.toBlob(blob => {
          if (!blob) { announce('Could not save this look. Please try again.'); return; }
          const url = URL.createObjectURL(blob), a = document.createElement('a');
          a.href = url; a.download = 'irismix-my-look.png'; a.click();
          setTimeout(() => URL.revokeObjectURL(url), 10000); announce('Your look is ready to save');
        }, 'image/png');
      });
      $('studio').setAttribute('aria-busy', 'false'); applyPreset('everyday');
    } catch (error) {
      $('studio').setAttribute('aria-busy', 'false'); $('error').hidden = false;
      announce('The palette could not load'); console.error(error);
    }
  }
  start();
})();
