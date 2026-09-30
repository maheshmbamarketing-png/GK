(function () {
  'use strict';

  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
  var indicator = document.getElementById('pageIndicator');
  var current = 0;

  function updateIndicator() {
    indicator.textContent = 'Page ' + (current + 1) + ' / ' + pages.length;
  }

  function goTo(index) {
    if (index < 0 || index >= pages.length) return;
    current = index;
    pages[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    updateIndicator();
  }

  // Global functions (kept for compatibility with any inline onclick usage)
  window.prevPage = function () { goTo(current - 1); };
  window.nextPage = function () { goTo(current + 1); };

  document.getElementById('prevBtn').addEventListener('click', window.prevPage);
  document.getElementById('nextBtn').addEventListener('click', window.nextPage);
  document.getElementById('printBtn').addEventListener('click', function () { window.print(); });

  // Keep the indicator in sync while scrolling: the page occupying the
  // middle of the viewport is the current page.
  function syncOnScroll() {
    var mid = window.innerHeight / 2;
    for (var i = 0; i < pages.length; i++) {
      var r = pages[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) {
        if (i !== current) { current = i; updateIndicator(); }
        return;
      }
    }
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { syncOnScroll(); ticking = false; });
  }, { passive: true });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { window.nextPage(); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { window.prevPage(); }
  });

  // Show a neutral placeholder if an image is missing from /assets
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () { img.classList.add('imgMissing'); });
  });

  updateIndicator();
  syncOnScroll();
})();
