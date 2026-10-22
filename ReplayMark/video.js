(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const players = [];
  document.querySelectorAll('.comparison-video').forEach(figure => {
    const video = figure.querySelector('video');
    const toggle = figure.querySelector('.film-toggle, #film-toggle');
    const restart = figure.querySelector('.film-restart, #film-restart');
    if (!video || !toggle || !restart) return;
    let inView = false, manuallyPaused = false;
    const updateButton = () => {
      toggle.textContent = video.paused ? '▶' : 'Ⅱ';
      toggle.setAttribute('aria-label', video.paused ? 'Play animation' : 'Pause animation');
    };
    const play = () => {
      video.preload = 'auto';
      video.play().catch(() => {});
    };
    const sync = () => {
      if (reduced.matches || saveData || !inView || document.hidden || manuallyPaused) video.pause();
      else play();
    };
    toggle.addEventListener('click', () => {
      if (video.paused) { manuallyPaused = false; play(); }
      else { manuallyPaused = true; video.pause(); }
    });
    restart.addEventListener('click', () => { video.currentTime = 0; manuallyPaused = false; play(); });
    video.addEventListener('play', updateButton);
    video.addEventListener('pause', updateButton);
    video.controls = false;
    figure.querySelector('.film-controls').hidden = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => { inView = entries[0].isIntersecting; sync(); }, {threshold: 0.2}).observe(video);
    }
    players.push(sync);updateButton();
  });
  document.addEventListener('visibilitychange', () => players.forEach(sync => sync()));
  reduced.addEventListener('change', () => players.forEach(sync => sync()));
})();
