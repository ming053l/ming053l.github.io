/* Publication preview videos: poster first, buffer one screen ahead, play while visible, crossfade on the first real frame.
   Markup: <div class="pv" data-pv><video preload="none" muted loop playsinline>…</video><img class="pv-poster" …></div> */
(function () {
  var wraps = Array.prototype.slice.call(document.querySelectorAll('[data-pv]'));
  if (!wraps.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var conn = navigator.connection || {};
  var lite = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
  var auto = !reduce && !lite && 'IntersectionObserver' in window;
  var visible = new Set();

  wraps.forEach(function (w) {
    var v = w.querySelector('video');
    var on = function () { w.classList.add('pv-on'); };
    v.addEventListener('playing', on);
    v.addEventListener('timeupdate', function () { if (v.currentTime > 0.05) on(); });
    // controls only when the visitor reaches for them, so no loading spinner is ever painted over the poster
    w.addEventListener('pointerenter', function () { v.controls = true; });
    w.addEventListener('pointerleave', function () { if (auto) v.controls = false; });
    v.addEventListener('focus', function () { v.controls = true; });
    if (!auto) { v.controls = true; v.addEventListener('play', on); }
  });
  if (!auto) return;

  // pre-buffer one video at a time (nearest first) so the one on screen never competes for bandwidth
  var queue = [], busy = false;
  function start(v) { if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); } }
  function pump() {
    if (busy || !queue.length) return;
    var v = queue.shift();
    if (v.readyState >= 4) return pump();
    busy = true; start(v);
    var done = function () { busy = false; v.removeEventListener('canplaythrough', done); pump(); };
    v.addEventListener('canplaythrough', done);
    setTimeout(function () { if (busy) done(); }, 2500);
  }
  function warm(v, now) {
    if (now) { start(v); return; }
    if (queue.indexOf(v) < 0 && v.preload !== 'auto') { queue.push(v); pump(); }
  }
  var ahead = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { warm(e.target.querySelector('video')); ahead.unobserve(e.target); } });
  }, { rootMargin: '120% 0px' });
  var view = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target.querySelector('video');
      if (e.isIntersecting) { visible.add(v); warm(v, true); if (!document.hidden) v.play().catch(function () {}); }
      else { visible.delete(v); v.pause(); }
    });
  }, { threshold: 0.2 });
  wraps.forEach(function (w) { ahead.observe(w); view.observe(w); });
  document.addEventListener('visibilitychange', function () {
    visible.forEach(function (v) { if (document.hidden) v.pause(); else v.play().catch(function () {}); });
  });
})();
