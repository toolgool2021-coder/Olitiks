(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];

  function getCount() {
    if (window.innerWidth < 600) return 34;
    if (window.innerWidth < 1200) return 52;
    return 68;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles = Array.from({ length: getCount() }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.7 + 0.35,
      v: Math.random() * 0.48 + 0.12,
      drift: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.65 + 0.2,
    }));
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.y += p.v;
      p.x += p.drift;

      if (p.y > height + 5) {
        p.y = -5;
        p.x = Math.random() * width;
      }

      if (p.x < -5) p.x = width + 5;
      if (p.x > width + 5) p.x = -5;

      ctx.beginPath();
      ctx.fillStyle = `rgba(90, 184, 255, ${p.alpha})`;
      ctx.shadowColor = '#168cff';
      ctx.shadowBlur = 8;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  animate();
})();

document.querySelectorAll('.social').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (link.getAttribute('href') === '#') {
      event.preventDefault();
    }
  });
});

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.style.scrollBehavior = 'auto';
}
