(() => {
  const video = document.getElementById('comparison-video');
  if (!video) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const toggle = document.getElementById('film-toggle');
  let inView = false, manuallyPaused = false;
  function updateButton() {
    toggle.textContent = video.paused ? '▶' : 'Ⅱ';
    toggle.setAttribute('aria-label', video.paused ? 'Play comparison video' : 'Pause comparison video');
  }
  function sync() {
    if (reduced.matches || saveData || !inView || document.hidden || manuallyPaused) video.pause();
    else video.play().catch(() => {});
  }
  toggle.addEventListener('click', () => {
    if (video.paused) { manuallyPaused = false; video.play().catch(() => {}); }
    else { manuallyPaused = true; video.pause(); }
  });
  document.getElementById('film-restart').addEventListener('click', () => { video.currentTime = 0; manuallyPaused = false; video.play().catch(() => {}); });
  video.addEventListener('play', updateButton); video.addEventListener('pause', updateButton);
  video.controls = false;
  document.querySelector('.film-controls').hidden = false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { inView = entries[0].isIntersecting; sync(); }, {threshold: 0.2}).observe(video);
  }
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  updateButton();
})();
