/* js/main.js — Effets visuels : poussière, cartes sprints, reveal */

/* ============================================================
   POUSSIÈRE DE LIVRES — particules flottantes sur le hero
   ============================================================ */
function initDust() {
  const canvas = document.getElementById('dust-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.35 - 0.05,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5
        ? `rgba(232,201,126,` // or
        : `rgba(168,93,224,`  // violet
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 80 }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.0003;
      if (p.y < -5 || p.alpha <= 0) Object.assign(p, makeParticle(), { y: H + 5, alpha: Math.random() * 0.4 + 0.1 });
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
}

/* ============================================================
   CARTES SPRINTS — Défi 2
   ============================================================ */
const sprintData = [
  { num: 1,  min: 20,  dur: 20,  vol: 155, cadence: 7.75  },
  { num: 2,  min: 24,  dur: 4,   vol: 43,  cadence: 10.75 },
  { num: 3,  min: 37,  dur: 13,  vol: 135, cadence: 10.38 },
  { num: 4,  min: 52,  dur: 15,  vol: 260, cadence: 17.33 },
  { num: 5,  min: 57,  dur: 5,   vol: 146, cadence: 29.20 },
  { num: 6,  min: 69,  dur: 12,  vol: 444, cadence: 37.00 },
  { num: 7,  min: 82,  dur: 13,  vol: 506, cadence: 38.92 },
  { num: 8,  min: 90,  dur: 8,   vol: 311, cadence: 38.88 },
  { num: 9,  min: 104, dur: 14,  vol: 442, cadence: 31.57 },
  { num: 10, min: 120, dur: 16,  vol: 562, cadence: 35.13 },
  { num: 11, min: 125, dur: 5,   vol: 68,  cadence: 13.60, isFinal: true }
];

function buildSprintCards() {
  const container = document.getElementById('sprints-grid');
  if (!container) return;

  const maxCadence = Math.max(...sprintData.map(s => s.cadence));

  sprintData.forEach(s => {
    const isBest = s.cadence === maxCadence;
    const pct = (s.cadence / maxCadence * 100).toFixed(1);
    const card = document.createElement('div');
    card.className = 'sprint-card' + (isBest ? ' best' : '');
    card.innerHTML = `
      <div class="sprint-num">Sprint ${s.num} · t=${s.min} min</div>
      <div class="sprint-books">${s.vol}<span> livres</span></div>
      <div class="sprint-meta">⏱ ${s.dur} min${s.isFinal ? '  ·  FIN' : ''}</div>
      <div class="sprint-cadence">${s.cadence.toFixed(2)} l/min</div>
      <div class="cadence-bar">
        <div class="cadence-fill" style="width:0%" data-pct="${pct}"></div>
      </div>
    `;
    container.appendChild(card);
  });
}

/* ============================================================
   SCROLL REVEAL — IntersectionObserver léger
   ============================================================ */
function initReveal() {
  const targets = document.querySelectorAll('.chart-card, .sprint-card, .section-header');
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.55s ease, transform 0.55s ease; }
    .reveal.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 60 + 'ms';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // Animer les barres de cadence quand elles entrent
        e.target.querySelectorAll('.cadence-fill').forEach(bar => {
          setTimeout(() => bar.style.width = bar.dataset.pct + '%', 100);
        });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initDust();
  buildSprintCards();
  initReveal();
});
