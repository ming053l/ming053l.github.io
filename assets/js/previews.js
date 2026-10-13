/* Publication preview videos: poster first, buffer one screen ahead, play while visible, crossfade on the first real frame.
   Markup: <div class="pv" data-pv><video preload="none" muted loop playsinline><source src="images/web/NAME.mp4?v=N">…</video>
           <picture><source srcset="images/web/NAME.avif?v=N" type="image/avif"><img class="pv-poster" src="images/web/NAME.webp?v=N" …></picture></div>
   Two rungs: every autoplaying video starts on images/web/NAME-lite.mp4 (640 px, <= 600 kbit/s) so the first frame comes
   as early as possible; on a fast link, once it plays on screen and nothing visible is still waiting for data, the full
   NAME.mp4 is buffered in a hidden second <video> on top, started in step with the first and crossfaded in, and the
   lite element is dropped. Slow or metered links stay on the lite file. Low-memory and touch devices drop the buffers
   of videos more than ~2 screens away and refill them (from the HTTP cache) on the way back. */
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
  var vid = function (w) { return w.querySelector('video'); };  // the element in view (an incoming HD copy comes after it)
  var full = function (v) { return v.querySelector('source').getAttribute('src'); };
  var lite = function (u) { return u.replace(/\.mp4(?=\?|$)/, '-lite.mp4'); };

  function wire(w, v) {
    var on = function () { w.classList.add('pv-on'); };
    v.addEventListener('playing', on);
    v.addEventListener('timeupdate', function () { if (!v.paused && v.currentTime > 0.05) on(); });
    v.addEventListener('focus', function () { v.controls = true; });
    if (!auto) { v.controls = true; v.addEventListener('play', on); return; }
    v.addEventListener('playing', later);
    v.addEventListener('canplaythrough', later);
    // a visible video starved of data outranks any upgrade (a brief 'waiting' at the loop point is not starvation)
    v.addEventListener('waiting', function () {
      setTimeout(function () { if (up && v !== up.hd && visible.has(v) && !v.paused && v.readyState < 3) abort(15000); }, 500);
    });
  }
  wraps.forEach(function (w) {
    var v = vid(w);
    // choose the file before anything is fetched: every video is preload="none" in the markup, and a src attribute
    // overrides the <source> list without a load() call (which in Chromium would ignore preload="none").
    // Autoplay always opens on the lite rung; reduced motion (play on request) takes the full file unless the link is slow.
    // The inline snippet after the top video applies the same rule to that one while the page is still parsing.
    if ((auto || slow) && !v.getAttribute('src')) v.src = lite(full(v));
    // controls only when the visitor reaches for them, so no loading spinner is ever painted over the poster
    w.addEventListener('pointerenter', function () { vid(w).controls = true; });
    w.addEventListener('pointerleave', function () { if (auto) vid(w).controls = false; });
    wire(w, v);
  });
  if (!auto) return;

  // pre-buffer one video at a time (nearest first) so the one on screen never competes for bandwidth
  var queue = [], busy = false;
  function start(v) { if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); } }
  function pump() {
    if (busy || !queue.length) return later();
    var v = queue.shift();
    if (v.readyState >= 4) return pump();
    busy = true; start(v);
    var done = function () { busy = false; v.removeEventListener('canplaythrough', done); pump(); };
    v.addEventListener('canplaythrough', done);
    setTimeout(function () { if (busy) done(); }, 2500);
  }
  function warm(v, now) {
    if (v.dataset.pvOff) restore(v);
    if (now) { if (up && up.lo !== v && v.readyState < 4) abort(); start(v); return; }
    if (queue.indexOf(v) < 0 && v.preload !== 'auto') { queue.push(v); pump(); }
  }

  // release / restore the media buffer (frugal devices only); the poster covers the gap
  function release(v) {
    if (up && up.lo === v) abort();
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

  // upgrade to the full file: one at a time, only for a video playing on screen, only when the pre-buffer queue is
  // idle and every visible video has its data; the HD copy is fully buffered before it is shown
  var up = null, cool = 0, LEAD = 0.25, raf = window.requestAnimationFrame.bind(window);
  function drop(v) { v.pause(); v.removeAttribute('src'); v.textContent = ''; v.load(); if (v.parentNode) v.parentNode.removeChild(v); }
  function abort(backoff) {
    if (!up) return;
    var hd = up.hd; up = null; drop(hd);
    if (backoff) cool = Date.now() + backoff;
    later();
  }
  var pending = 0;
  function later() { if (!pending) pending = setTimeout(function () { pending = 0; upgrade(); }, 250); }
  function upgrade() {
    if (slow || up || busy || queue.length || document.hidden) return;
    if (Date.now() < cool) { setTimeout(later, cool - Date.now()); return; }
    var lo = null, best = 0, need = false;
    visible.forEach(function (v) {  // the playing lite video taking up the most of the screen goes first
      if (v.readyState < 4) need = true;
      var w = v.parentElement, r = w.getBoundingClientRect();
      var a = (Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0)) * r.width;
      if (a > best && !w.pvHd && !v.paused && !v.dataset.pvOff && w.classList.contains('pv-on')) { lo = v; best = a; }
    });
    if (need || !lo) return;
    var w = lo.parentElement, hd = lo.cloneNode(true), u = up = { w: w, lo: lo, hd: hd };
    hd.removeAttribute('id'); hd.removeAttribute('aria-label'); hd.removeAttribute('controls');
    hd.setAttribute('aria-hidden', 'true'); hd.tabIndex = -1; hd.className = 'pv-hd';
    hd.muted = true; hd.preload = 'auto'; hd.src = full(lo);
    hd.addEventListener('error', function () { if (up === u) { w.pvHd = 'failed'; abort(); } });
    wire(w, hd);
    w.insertBefore(hd, lo.nextSibling);
    var ready = function () {
      var b = hd.buffered, whole = b.length && b.end(b.length - 1) >= hd.duration - 0.1;
      if (up !== u || hd.readyState < 4 || !(whole || u.stalled)) return;
      ['canplaythrough', 'progress', 'suspend'].forEach(function (e) { hd.removeEventListener(e, ready); });
      sync(u);
    };
    hd.addEventListener('suspend', function () { u.stalled = true; });  // the browser decided to stop buffering
    ['canplaythrough', 'progress', 'suspend'].forEach(function (e) { hd.addEventListener(e, ready); });
  }
  // park the HD copy a little ahead of the lite one, start it as the lite one gets there, show it on its first new frame.
  // A server without byte ranges leaves the file unseekable; then the HD copy waits at 0 and takes over at the loop point.
  function sync(u) {
    if (up !== u) return;
    var lo = u.lo, hd = u.hd, dur = lo.duration;
    if (lo.paused || document.hidden) { lo.addEventListener('playing', function () { sync(u); }, { once: true }); return; }
    var t = lo.currentTime + LEAD, s = hd.seekable, ok = false;
    for (var i = 0; i < s.length; i++) if (s.start(i) <= t && t <= s.end(i)) ok = true;
    if (ok && t > Math.min(dur, hd.duration) - 0.3) { setTimeout(function () { sync(u); }, 400); return; }  // too close to the loop point
    if (!ok) t = 0;
    var span = ok ? LEAD : dur;  // the longest wait expected before the lite copy reaches t
    var gap = function (a, b) { var d = ((a - b) % dur + dur) % dur; return Math.min(d, dur - d); };
    hd.addEventListener('seeked', function () {
      (function tick() {
        if (up !== u) return;
        var d = ((t - lo.currentTime) % dur + dur) % dur;  // time until the lite copy reaches t
        if (lo.paused || (d > span + 0.1 && d < dur - 0.1)) return sync(u);  // paused or jumped: park again
        if (d > 0.03 && d < dur - 0.1) return raf(tick);
        hd.play().catch(function () {});
        var shown = false, show = function () {
          if (shown || up !== u) return; shown = true;
          if (gap(hd.currentTime, lo.currentTime) > 0.15) { hd.pause(); return sync(u); }
          hd.classList.add('pv-hd-in');
          setTimeout(function () { swap(u); }, 320);
        };
        if (hd.requestVideoFrameCallback) hd.requestVideoFrameCallback(function () { show(); });
        else hd.addEventListener('playing', function () { setTimeout(show, 60); }, { once: true });
        setTimeout(function () { if (!hd.paused) show(); }, 500);
      })();
    }, { once: true });
    hd.currentTime = t;
  }
  function swap(u) {
    if (up !== u) return;
    var lo = u.lo, hd = u.hd, w = u.w, focused = document.activeElement === lo;
    ['id', 'aria-label'].forEach(function (a) {
      if (lo.hasAttribute(a)) { var x = lo.getAttribute(a); lo.removeAttribute(a); hd.setAttribute(a, x); }
    });
    hd.removeAttribute('aria-hidden'); hd.removeAttribute('tabindex');
    hd.controls = lo.controls;
    drop(lo);
    hd.removeAttribute('class');  // back in the flow, same box as the element it replaces
    if (focused) hd.focus({ preventScroll: true });
    if (visible.delete(lo)) visible.add(hd);
    w.pvHd = true; up = null;
    later();
  }

  var ahead = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = vid(e.target);
      if (e.isIntersecting) { warm(v); if (!frugal) ahead.unobserve(e.target); }
    });
  }, { rootMargin: '120% 0px' });
  var view = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = vid(e.target);
      if (e.isIntersecting) { visible.add(v); warm(v, true); if (!document.hidden) v.play().catch(function () {}); }
      else { visible.delete(v); v.pause(); if (up && up.w === e.target) abort(); }
    });
    later();
  }, { threshold: 0.2 });
  // the topmost video already on screen starts fetching now, a frame ahead of the observers and the lazy posters
  wraps.some(function (w) {
    var r = w.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight) { start(vid(w)); return true; }
  });
  wraps.forEach(function (w) { ahead.observe(w); view.observe(w); });
  if (frugal) {
    var far = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (!e.isIntersecting) release(vid(e.target)); });
    }, { rootMargin: '200% 0px' });
    wraps.forEach(function (w) { far.observe(w); });
  }
  document.addEventListener('visibilitychange', function () {
    visible.forEach(function (v) { if (document.hidden) v.pause(); else v.play().catch(function () {}); });
    later();
  });
})();
