/* js/chart-defi2.js — Graphique Défi 2 : 3072 livres en < 3h */

const ptsLivres = [
  {x:0,y:0},{x:20,y:155},{x:24,y:198},{x:37,y:333},{x:52,y:593},
  {x:57,y:739},{x:69,y:1183},{x:82,y:1689},{x:90,y:2000},{x:104,y:2442},
  {x:120,y:3004},{x:125,y:3072}
];

const ptsEtageres = [
  {x:37,y:16},{x:52,y:39},{x:57,y:57},{x:69,y:116},{x:82,y:182},
  {x:90,y:222},{x:104,y:289},{x:120,y:376},{x:125,y:400}
];

const sprintDetails = {
  20:  {dur:20,  vol:155, cadence:7.75},
  24:  {dur:4,   vol:43,  cadence:10.75},
  37:  {dur:13,  vol:135, cadence:10.38},
  52:  {dur:15,  vol:260, cadence:17.33, etag:{dur:15, vol:23, cadence:1.53}},
  57:  {dur:5,   vol:146, cadence:29.20, etag:{dur:5,  vol:18, cadence:3.60}},
  69:  {dur:12,  vol:444, cadence:37.00, etag:{dur:12, vol:59, cadence:4.92}},
  82:  {dur:13,  vol:506, cadence:38.92, etag:{dur:13, vol:66, cadence:5.08}},
  90:  {dur:8,   vol:311, cadence:38.88, etag:{dur:8,  vol:40, cadence:5.00}},
  104: {dur:14,  vol:442, cadence:31.57, etag:{dur:14, vol:67, cadence:4.79}},
  120: {dur:16,  vol:562, cadence:35.13, etag:{dur:16, vol:87, cadence:5.44}},
  125: {dur:5,   vol:68,  cadence:13.60, etag:{dur:5,  vol:24, cadence:4.80}}
};

const maxX = 150;

const sprintMap = {
  20:'Sprint 1', 24:'Sprint 2', 37:'Sprint 3', 52:'Sprint 4',
  57:'Sprint 5', 69:'Sprint 6', 82:'Sprint 7', 90:'Sprint 8',
  104:'Sprint 9', 120:'Sprint 10', 125:'Sprint 11 (Final)'
};

function initChartDefi2() {
  const ctx = document.getElementById('canvas-defi2');
  if (!ctx) return;

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Livres rangés',
          data: ptsLivres,
          borderColor: '#1d9e75',
          backgroundColor: 'rgba(29,158,117,0.10)',
          fill: true,
          tension: 0.15,
          pointBackgroundColor: '#1d9e75',
          pointBorderColor: '#0e0b1a',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 9,
          yAxisID: 'y',
          borderWidth: 2.5
        },
        {
          label: 'Étagères',
          data: ptsEtageres,
          borderColor: '#3266ad',
          backgroundColor: 'rgba(50,102,173,0.07)',
          fill: false,
          tension: 0.15,
          pointBackgroundColor: '#3266ad',
          pointBorderColor: '#0e0b1a',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          yAxisID: 'y1',
          borderWidth: 2
        },
        {
          label: 'Objectif',
          data: [{x:0,y:3072},{x:maxX,y:3072}],
          borderColor: 'rgba(232,201,126,0.4)',
          borderDash: [6,4],
          pointRadius: 0,
          borderWidth: 1.5,
          yAxisID: 'y',
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(13,10,20,0.92)',
          titleColor: '#e8c97e',
          bodyColor: 'rgba(240,232,216,0.8)',
          titleFont: { family: "'Cinzel', serif", size: 11, weight: '600' },
          bodyFont: { family: "'JetBrains Mono', monospace", size: 11 },
          padding: 12,
          borderColor: 'rgba(201,134,10,0.4)',
          borderWidth: 1,
          filter: ctx => ctx.dataset.label === 'Livres rangés' || ctx.dataset.label === 'Étagères',
          callbacks: {
            title(context) {
              const x = context[0].parsed.x;
              return (sprintMap[x] || 'Sprint') + '  ·  t=' + x + ' min';
            },
            label(context) {
              const x = context.parsed.x;
              const d = sprintDetails[x];
              if (context.dataset.label === 'Livres rangés' && d) {
                const rows = [`  📚 +${d.vol} livres`, `  ⏱ ${d.dur} min  ·  ${d.cadence.toFixed(2)} l/min`];
                if (x === 125) rows.push('  ✓ DÉFI ACCOMPLI');
                return rows;
              }
              if (context.dataset.label === 'Étagères' && d?.etag) {
                const e = d.etag;
                return [`  🏠 Total: ${context.parsed.y} étagères`, `  +${e.vol} ce sprint  ·  ${e.cadence.toFixed(2)} étag/min`];
              }
              return '';
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear', min: 0, max: maxX,
          title: { display: true, text: 'Temps cumulé (min)', font: { size: 10, family: "'Inter', sans-serif" }, color: 'rgba(240,232,216,0.4)' },
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: 'rgba(240,232,216,0.45)', stepSize: 15, font: { family: "'JetBrains Mono', monospace", size: 10 } }
        },
        y: {
          type: 'linear', min: 0, max: 3300, position: 'left',
          title: { display: true, text: 'Livres rangés', font: { size: 10 }, color: '#1d9e75' },
          grid: { color: 'rgba(29,158,117,0.08)' },
          ticks: { color: 'rgba(29,158,117,0.7)', font: { family: "'JetBrains Mono', monospace", size: 10 } }
        },
        y1: {
          type: 'linear', min: 0, max: 400, position: 'right',
          title: { display: true, text: 'Étagères', font: { size: 10 }, color: '#3266ad' },
          grid: { display: false },
          ticks: { color: 'rgba(50,102,173,0.7)', font: { family: "'JetBrains Mono', monospace", size: 10 } }
        }
      }
    }
  });

  // Filtres
  const btnL = document.getElementById('d2-btn-livres');
  const btnE = document.getElementById('d2-btn-etageres');
  const btnA = document.getElementById('d2-btn-tous');

  function setFilter(active) {
    [btnL, btnE, btnA].forEach(b => b.classList.remove('active'));
    active.classList.add('active');
    const showL = active !== btnE;
    const showE = active !== btnL;
    chart.data.datasets[0].borderColor = showL ? '#1d9e75' : 'rgba(29,158,117,0.12)';
    chart.data.datasets[0].pointBackgroundColor = showL ? '#1d9e75' : 'rgba(29,158,117,0.12)';
    chart.data.datasets[0].backgroundColor = showL ? 'rgba(29,158,117,0.10)' : 'rgba(29,158,117,0.01)';
    chart.data.datasets[1].borderColor = showE ? '#3266ad' : 'rgba(50,102,173,0.12)';
    chart.data.datasets[1].pointBackgroundColor = showE ? '#3266ad' : 'rgba(50,102,173,0.12)';
    chart.update();
  }

  btnL.addEventListener('click', () => setFilter(btnL));
  btnE.addEventListener('click', () => setFilter(btnE));
  btnA.addEventListener('click', () => setFilter(btnA));
  btnL.classList.add('active');

  // Export
  document.getElementById('d2-export').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = chart.toBase64Image('image/png', 1);
    a.download = 'defi2_VICTOIRE_2h04.png';
    a.click();
  });
}

document.addEventListener('DOMContentLoaded', initChartDefi2);
