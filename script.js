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

// ===== FIRE PARTICLES BEHIND AVATAR =====
(function initFireParticles() {
  const avatarWrap = document.querySelector('.avatar-wrap');
  if (!avatarWrap) return;

  const particlesContainer = avatarWrap.querySelector('.fire-particles-container');
  if (!particlesContainer) return;

  const fireParticles = [];
  const maxParticles = 40;
  let particleIndex = 0;

  class FireParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * 180 + 5;
      this.y = 190 + Math.random() * 30;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = Math.random() * 1.5 + 0.5;
      this.life = 0;
      this.maxLife = Math.random() * 40 + 30;
      this.size = Math.random() * 8 + 3;
      this.color = Math.random() < 0.5 ? 'fire' : 'smoke';
    }

    update() {
      this.x += this.vx;
      this.y -= this.vy;
      this.life++;
      this.vy += 0.02;
      this.size -= 0.08;
    }

    isDead() {
      return this.life >= this.maxLife || this.size <= 0;
    }

    getElement() {
      let element = document.getElementById(`fire-particle-${particleIndex}`);
      if (!element) {
        element = document.createElement('div');
        element.id = `fire-particle-${particleIndex}`;
        element.className = `fire-particle ${this.color}`;
        particlesContainer.appendChild(element);
      }
      particleIndex++;
      return element;
    }

    render(element) {
      const progress = this.life / this.maxLife;
      let opacity;

      if (this.color === 'fire') {
        opacity = Math.max(0, 1 - progress * 1.5);
      } else {
        opacity = Math.max(0, 0.6 - progress);
      }

      element.style.left = this.x + 'px';
      element.style.top = this.y + 'px';
      element.style.width = this.size + 'px';
      element.style.height = this.size + 'px';
      element.style.opacity = opacity;
    }
  }

  function createParticle() {
    if (fireParticles.length < maxParticles) {
      fireParticles.push(new FireParticle());
    }
  }

  function animateFireParticles() {
    particleIndex = 0;

    if (Math.random() < 0.4) {
      createParticle();
    }

    for (let i = fireParticles.length - 1; i >= 0; i--) {
      const particle = fireParticles[i];
      particle.update();

      if (particle.isDead()) {
        fireParticles.splice(i, 1);
      } else {
        const element = particle.getElement();
        particle.render(element);
      }
    }

    const elements = particlesContainer.querySelectorAll('.fire-particle');
    for (let i = particleIndex; i < elements.length; i++) {
      elements[i].remove();
    }

    requestAnimationFrame(animateFireParticles);
  }

  animateFireParticles();
})();

// ===== SOCIAL LINK HANDLER =====
document.querySelectorAll('.social').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const href = link.getAttribute('data-href');
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  });
});

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.style.scrollBehavior = 'auto';
}
