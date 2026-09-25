// Cible par défaut, écrasée si l'utilisateur en règle une manuellement
let TARGET = new Date("2026-09-25T00:00:00+00:00").getTime();
const saved = localStorage.getItem('countdownTarget');
if(saved) TARGET = parseInt(saved,10);

const units = [
  {id:'d', label:'JOURS'},
  {id:'h', label:'HEURES'},
  {id:'m', label:'MINUTES'},
  {id:'s', label:'SECONDES'}
];
const grid = document.getElementById('grid');
units.forEach(u=>{
  const el = document.createElement('div');
  el.className='unit';
  el.innerHTML = `<div class="num" id="${u.id}">00</div><div class="lbl">${u.label}</div>`;
  grid.appendChild(el);
});
function pad(n){return String(n).padStart(2,'0');}
function tick(){
  const now = Date.now();
  let diff = TARGET - now;
  if(diff <= 0){
    ['d','h','m','s'].forEach(id=>document.getElementById(id).textContent='00');
    return;
  }
  const d = Math.floor(diff/86400000); diff -= d*86400000;
  const h = Math.floor(diff/3600000); diff -= h*3600000;
  const m = Math.floor(diff/60000); diff -= m*60000;
  const s = Math.floor(diff/1000);
  document.getElementById('d').textContent = pad(d);
  document.getElementById('h').textContent = pad(h);
  document.getElementById('m').textContent = pad(m);
  document.getElementById('s').textContent = pad(s);
}
tick();
setInterval(tick,1000);

/* ==========================================================
   Réglage manuel du chrono
   ========================================================== */
function initSettings(){
  const toggle = document.getElementById('settingsToggle');
  const panel = document.getElementById('settingsPanel');
  const input = document.getElementById('targetInput');
  const btn = document.getElementById('setTargetBtn');
  if(!toggle || !panel || !input || !btn) return;

  function toLocalInputValue(ts){
    const d = new Date(ts);
    const off = d.getTimezoneOffset();
    const local = new Date(ts - off*60000);
    return local.toISOString().slice(0,16);
  }
  input.value = toLocalInputValue(TARGET);

  toggle.addEventListener('click', ()=>{
    panel.classList.toggle('open');
  });
  btn.addEventListener('click', ()=>{
    if(!input.value) return;
    const newTarget = new Date(input.value).getTime();
    if(isNaN(newTarget)) return;
    TARGET = newTarget;
    localStorage.setItem('countdownTarget', String(TARGET));
    tick();
    panel.classList.remove('open');
  });
}
initSettings();

/* ==========================================================
   Particules flottantes — identiques à ctf.esig.tg
   ========================================================== */
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const COUNT = 90;
    const colors = ['c-violet', 'c-cyan', 'c-violet', 'c-pink', 'c-cyan'];

    for (let i = 0; i < COUNT; i++) {
        const p = document.createElement('div');
        const size = 2 + Math.random() * 4;
        const left = Math.random() * 100;
        const duration = 9 + Math.random() * 14;
        const delay = Math.random() * 18;
        const drift = (Math.random() - 0.5) * 160;

        p.className = 'particle ' + colors[Math.floor(Math.random() * colors.length)];
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = left + 'vw';
        p.style.setProperty('--drift', drift + 'px');
        p.style.animationDuration = duration + 's';
        p.style.animationDelay = '-' + delay + 's';
        container.appendChild(p);
    }
}

/* ==========================================================
   Couche d'éclairs SVG — identique à ctf.esig.tg
   ========================================================== */
function initElectricLayer() {
    const layer = document.getElementById('electricLayer');
    if (!layer) return;

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('preserveAspectRatio', 'none');

    const defs = document.createElementNS(svgNS, 'defs');
    const grad = document.createElementNS(svgNS, 'linearGradient');
    grad.setAttribute('id', 'boltGradientCTF');
    grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '0%'); grad.setAttribute('y2', '100%');
    const stops = [
        ['0%', '#22E5C8'],
        ['45%', '#a78bfa'],
        ['75%', '#8B5CF6'],
        ['100%', '#F14FA0'],
    ];
    stops.forEach(([offset, color]) => {
        const s = document.createElementNS(svgNS, 'stop');
        s.setAttribute('offset', offset);
        s.setAttribute('stop-color', color);
        grad.appendChild(s);
    });
    defs.appendChild(grad);
    svg.appendChild(defs);
    layer.appendChild(svg);

    function genBoltPath(w, h) {
        const startX = Math.random() * w;
        let x = startX;
        let y = 0;
        const segments = 7 + Math.floor(Math.random() * 5);
        const step = h / segments;
        let d = `M ${x} ${y}`;
        for (let i = 1; i <= segments; i++) {
            x += (Math.random() - 0.5) * 130;
            y = step * i;
            d += ` L ${x} ${y}`;
            if (Math.random() < 0.55 && i < segments - 1) {
                const bx = x + (Math.random() - 0.5) * 110;
                const by = y + step * 0.6;
                d += ` M ${x} ${y} L ${bx} ${by} M ${x} ${y}`;
            }
        }
        return d;
    }

    function strike() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

        const boltCount = 1 + Math.floor(Math.random() * 3);
        for (let b = 0; b < boltCount; b++) {
            const path = document.createElementNS(svgNS, 'path');
            path.setAttribute('d', genBoltPath(w, h));
            path.setAttribute('class', 'bolt-path');
            path.setAttribute('stroke-width', 1.6 + Math.random() * 2.2);
            const len = 500 + Math.random() * 200;
            path.style.strokeDasharray = len;
            path.style.strokeDashoffset = len;
            svg.appendChild(path);

            setTimeout(() => path.classList.add('strike'), b * 70);
            setTimeout(() => path.remove(), 900 + b * 70);
        }
    }

    function scheduleNext() {
        const delay = 700 + Math.random() * 1200;
        setTimeout(() => {
            strike();
            scheduleNext();
        }, delay);
    }

    strike();
    setTimeout(strike, 350);
    scheduleNext();
}

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initElectricLayer();
});
