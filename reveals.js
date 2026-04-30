// Generic scroll-reveal: elements with [data-reveal] fade + rise into view.
(function () {
  const els = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  els.forEach((el, i) => {
    el.style.setProperty('--reveal-delay', (i % 6) * 40 + 'ms');
    io.observe(el);
  });
})();
