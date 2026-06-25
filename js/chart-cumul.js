/* js/chart-cumul.js — Progression cumulée sur la session complète */

const ptsCumul = [
  {x:0,y:0},    {x:20,y:127},  {x:161,y:752}, {x:190,y:903},
  {x:212,y:1000},{x:227,y:1078},{x:252,y:1230},{x:302,y:1405},
  {x:320,y:1471},{x:342,y:1590},{x:356,y:1637},{x:372,y:1718},
  {x:384,y:1784},{x:399,y:1866},{x:422,y:2011},{x:451,y:2196},
  {x:483,y:2401},{x:510,y:2580},{x:541,y:2800},{x:571,y:2986},
  {x:582,y:3072},{x:592,y:3072}
];

const maxXCumul = 610;

// Précalcul des sprints
const sprintsCumul = [];
for (let i = 0; i < ptsCumul.length - 1; i++) {
  const dur = ptsCumul[i+1].x - ptsCumul[i].x;
  const vol = ptsCumul[i+1].y - ptsCumul[i].y;
  sprintsCumul.push({ dur, vol, cadence: vol / dur, startMin: ptsCumul[i].x });
}

function initChartCumul() {
  const ctx = document.getElementById('canvas-cumul');
  if (!ctx) return;

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Rangés',
          data: ptsCumul,
          borderColor: '#1d9e75',
          backgroundColor: 'rgba(29,158,117,0.10)',
          fill: true,
          tension: 0.18,
          pointBackgroundColor: '#1d9e75',
          pointBorderColor: '#0e0b1a',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
          borderWidth: 2.5
        },
        {
          label: 'Objectif 3 072',
          data: [{x:0,y:3072},{x:maxXCumul,y:3072}],
          borderColor: 'rgba(232,201,126,0.35)',
          borderDash: [6,4],
          pointRadius: 0,
          borderWidth: 1.5,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
          callbacks: {
            title(context) {
              const idx = context[0].dataIndex;
              if (idx === ptsCumul.length - 1) return 'Sprint 21  ·  Correction finale';
              return `Sprint ${idx + 1}  ·  t=${ptsCumul[idx].x} min`;
            },
            label(context) {
              const idx = context.dataIndex;
              if (idx < sprintsCumul.length) {
                const s = sprintsCumul[idx];
                if (idx === sprintsCumul.length - 1) {
                  return ['  ✓ Correction : -3 et +3', '  Net : 0 livres'];
                }
                return [
                  `  📚 +${s.vol} livres`,
                  `  ⏱ ${s.dur} min  ·  ${s.cadence.toFixed(2)} l/min`
                ];
              }
              return `Total : ${context.parsed.y}`;
            },
            afterLabel(context) {
              if (context.dataIndex === ptsCumul.length - 1) return '  🏆 Défi validé !';
              return '';
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear', min: 0, max: maxXCumul,
          title: { display: true, text: 'Temps cumulé (min)', font: { size: 10, family: "'Inter', sans-serif" }, color: 'rgba(240,232,216,0.4)' },
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: 'rgba(240,232,216,0.45)', stepSize: 60, font: { family: "'JetBrains Mono', monospace", size: 10 } }
        },
        y: {
          type: 'linear', min: 0, max: 3300,
          title: { display: true, text: 'Livres rangés', font: { size: 10 }, color: 'rgba(240,232,216,0.5)' },
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: 'rgba(240,232,216,0.45)', font: { family: "'JetBrains Mono', monospace", size: 10 } }
        }
      }
    }
  });

  // Export
  document.getElementById('cumul-export').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = chart.toBase64Image('image/png', 1);
    a.download = 'session_complete_3072_livres.png';
    a.click();
  });
}

document.addEventListener('DOMContentLoaded', initChartCumul);
