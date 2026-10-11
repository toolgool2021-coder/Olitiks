/**
 * Particle animation system
 * Creates smooth floating particles without external libraries
 */
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  
  let w = 0;
  let h = 0;
  let dpr = 1;
  let particles = [];
  
  /**
   * Calculate particle count based on screen size
   */
  const getParticleCount = () => {
    if (window.innerWidth < 600) return 34;
    if (window.innerWidth < 1200) return 50;
    return 65;
  };
  
  /**
   * Initialize canvas and particles on window resize
   */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth;
    h = window.innerHeight;
    
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    
    particles = Array.from({ length: getParticleCount() }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.7 + 0.35,
      v: Math.random() * 0.48 + 0.12,
      drift: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.65 + 0.2,
    }));
  }
  
  /**
   * Draw and animate particles
   */
  function draw() {
    ctx.clearRect(0, 0, w, h);
    
    for (const p of particles) {
      p.y += p.v;
      p.x += p.drift;
      
      // Wrap around edges
      if (p.y > h + 5) {
        p.y = -5;
        p.x = Math.random() * w;
      }
      if (p.x < -5) {
        p.x = w + 5;
      }
      if (p.x > w + 5) {
        p.x = -5;
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.fillStyle = `rgba(90, 184, 255, ${p.alpha})`;
      ctx.shadowColor = '#168cff';
      ctx.shadowBlur = 8;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.shadowBlur = 0;
    requestAnimationFrame(draw);
  }
  
  // Initialize
  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
})();

/**
 * Smooth scroll for social links
 */
document.querySelectorAll('.social').forEach(link => {
  link.addEventListener('click', (e) => {
    if (link.getAttribute('href') === '#') {
      e.preventDefault();
    }
  });
});

/**
 * Performance optimization for reduced motion
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.style.scrollBehavior = 'auto';
}
