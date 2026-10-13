/* Publication preview videos: poster first, buffer one screen ahead, play while visible, crossfade on the first real frame.
   Markup: <div class="pv" data-pv><video preload="none" muted loop playsinline><source src="images/web/NAME.mp4?v=N">…</video>
           <picture><source srcset="images/web/NAME.avif?v=N" type="image/avif"><img class="pv-poster" src="images/web/NAME.webp?v=N" …></picture></div>
   Slow or metered links get images/web/NAME-lite.mp4 (640 px, <= 600 kbit/s); low-memory and touch devices drop the
   buffers of videos more than ~2 screens away and refill them (from the HTTP cache) on the way back. */
(function () {
  var wraps = Array.prototype.slice.call(document.querySelectorAll('[data-pv]'));
  if (!wraps.length) return;
  var mm = function (q) { return !!(window.matchMedia && window.matchMedia(q).matches); };
  var reduce = mm('(prefers-reduced-motion: reduce)');
  var conn = navigator.connection || {};
  var ect = conn.effectiveType || '';
  var meager = conn.saveData || /(^|-)2g$/.test(ect);
  var slow = meager || ect === '3g' || (conn.downlink > 0 && conn.downlink < 3);
  var auto = !reduce && !meager && 'IntersectionObserver' in window;
  var frugal = auto && (navigator.deviceMemory <= 4 || mm('(pointer: coarse)'));
  var visible = new Set();

  wraps.forEach(function (w) {
    var v = w.querySelector('video');
    // choose the file before anything is fetched: every video is preload="none" in the markup, and a src attribute
    // overrides the <source> list without a load() call (which in Chromium would ignore preload="none").
    // The inline snippet after the top video applies the same rule to that one while the page is still parsing.
    if (slow && !v.getAttribute('src')) v.src = v.querySelector('source').getAttribute('src').replace(/\.mp4(?=\?|$)/, '-lite.mp4');
    var on = function () { w.classList.add('pv-on'); };
    v.addEventListener('playing', on);
    v.addEventListener('timeupdate', function () { if (!v.paused && v.currentTime > 0.05) on(); });
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
    if (v.dataset.pvOff) restore(v);
    if (now) { start(v); return; }
    if (queue.indexOf(v) < 0 && v.preload !== 'auto') { queue.push(v); pump(); }
  }

  // release / restore the media buffer (frugal devices only); the poster covers the gap
  function release(v) {
    if (v.dataset.pvOff || v.preload !== 'auto') return;
    v.pause();
    v.dataset.pvOff = v.currentTime || 0;
    var i = queue.indexOf(v); if (i >= 0) queue.splice(i, 1);
    v.parentElement.classList.remove('pv-on');
    [v].concat(Array.prototype.slice.call(v.querySelectorAll('source'))).forEach(function (s) {
      if (s.hasAttribute('src')) { s.dataset.pvSrc = s.getAttribute('src'); s.removeAttribute('src'); }
    });
    v.preload = 'none';
    v.load();  // nothing left to fetch: this just drops the decoder and the buffered data
  }
  function restore(v) {
    var t = +v.dataset.pvOff;
    delete v.dataset.pvOff;
    [v].concat(Array.prototype.slice.call(v.querySelectorAll('source'))).forEach(function (s) {
      if (s.dataset.pvSrc) { s.setAttribute('src', s.dataset.pvSrc); delete s.dataset.pvSrc; }
    });
    if (t > 0) v.addEventListener('loadedmetadata', function seek() {
      v.removeEventListener('loadedmetadata', seek);
      if (t < v.duration) v.currentTime = t;
    });
  }

  var ahead = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target.querySelector('video');
      if (e.isIntersecting) { warm(v); if (!frugal) ahead.unobserve(e.target); }
    });
  }, { rootMargin: '120% 0px' });
  var view = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target.querySelector('video');
      if (e.isIntersecting) { visible.add(v); warm(v, true); if (!document.hidden) v.play().catch(function () {}); }
      else { visible.delete(v); v.pause(); }
    });
  }, { threshold: 0.2 });
  // the topmost video already on screen starts fetching now, a frame ahead of the observers and the lazy posters
  wraps.some(function (w) {
    var r = w.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight) { start(w.querySelector('video')); return true; }
  });
  wraps.forEach(function (w) { ahead.observe(w); view.observe(w); });
  if (frugal) {
    var far = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (!e.isIntersecting) release(e.target.querySelector('video')); });
    }, { rootMargin: '200% 0px' });
    wraps.forEach(function (w) { far.observe(w); });
  }
  document.addEventListener('visibilitychange', function () {
    visible.forEach(function (v) { if (document.hidden) v.pause(); else v.play().catch(function () {}); });
  });
})();
