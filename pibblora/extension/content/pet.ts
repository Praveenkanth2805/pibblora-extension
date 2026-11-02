import { Settings, PET_ICONS } from './types';
import { getWebColor } from './theme';

let petEl: HTMLElement | null = null;
let webSvg: SVGSVGElement | null = null;
let isIdle = false;
let webDrawn = false;
let webAnimations: Animation[] = [];
let idleTimer: ReturnType<typeof setTimeout> | null = null;
let walkTimer: ReturnType<typeof setTimeout> | null = null;
let webDrawTimer: ReturnType<typeof setTimeout> | null = null;
let currentCorner = 'RB';
let currentTheme = 'cream';

export function setTheme(preset: string) {
  currentTheme = preset;

  if (webSvg) {
    const group = webSvg.querySelector('g');
    const color = getWebColor(currentTheme);

    if (group) {
      group.setAttribute('stroke', color);
      group.style.filter = `drop-shadow(0 0 3px ${color})`;
    }
  }
}

function getCornerPos(corner: string) {
  const margin = 40;
  const w = window.innerWidth;
  const h = window.innerHeight;
  switch (corner) {
    case 'RB': return { x: w - 100 - margin, y: h - 100 - margin };
    case 'LB': return { x: margin, y: h - 100 - margin };
    case 'LT': return { x: margin, y: margin };
    case 'RT': return { x: w - 100 - margin, y: margin };
    case 'CENTER': return { x: w / 2 - 32, y: h / 2 - 32 };
    default: return { x: 0, y: 0 };
  }
}



function createWebSVG() {
  if (webSvg) webSvg.remove();

  webAnimations.forEach(animation => animation.cancel());
  webAnimations = [];

  const svgNS = 'http://www.w3.org/2000/svg';
  const width = window.innerWidth;
  const height = window.innerHeight;
  const cx = width / 2;
  const cy = height / 2;
  const spokes = 24;
  const rings = 12;

  webSvg = document.createElementNS(svgNS, 'svg');
  webSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  webSvg.setAttribute('preserveAspectRatio', 'none');

  Object.assign(webSvg.style, {
    position: 'fixed',
    inset: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: '2147483638',
    overflow: 'hidden',
    opacity: '1',
  });

  const group = document.createElementNS(svgNS, 'g');
  const color = getWebColor(currentTheme);

  group.setAttribute('fill', 'none');
  group.setAttribute('stroke', color);
  group.setAttribute('stroke-width', '1.5');
  group.setAttribute('stroke-opacity', '0.95');
  group.setAttribute('stroke-linecap', 'round');
  group.setAttribute('stroke-linejoin', 'round');
  group.style.filter = `drop-shadow(0 0 3px ${color})`;

  // Find 24 points around the complete viewport boundary.
  const boundary = Array.from({ length: spokes }, (_, i) => {
    const angle = (i / spokes) * Math.PI * 2;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    const scale = Math.min(
      (width / 2) / Math.max(Math.abs(dx), 0.0001),
      (height / 2) / Math.max(Math.abs(dy), 0.0001)
    );

    return {
      x: cx + dx * scale,
      y: cy + dy * scale,
    };
  });

  // Radial support silk threads.
  boundary.forEach((point, i) => {
    const line = document.createElementNS(svgNS, 'line');

    line.setAttribute('x1', String(cx));
    line.setAttribute('y1', String(cy));
    line.setAttribute('x2', String(point.x));
    line.setAttribute('y2', String(point.y));
    line.setAttribute('class', 'web-silk');

    group.appendChild(line);
  });

  // Curved connecting spiral silk threads.
  for (let i = 0; i < rings; i++) {
    const progress = (i + 1) / rings;
    const points = boundary.map((point, j) => {
      const irregularity = 1 + 0.012 * Math.sin(j * 2.3 + i);
      const t = progress * irregularity;

      return {
        x: cx + (point.x - cx) * t,
        y: cy + (point.y - cy) * t,
      };
    });

    let d = '';

    points.forEach((point, j) => {
      const next = points[(j + 1) % spokes];
      const mx = (point.x + next.x) / 2;
      const my = (point.y + next.y) / 2;

      d += `${j === 0 ? `M ${mx} ${my}` : ''} Q ${point.x} ${point.y} ${mx} ${my} `;
    });

    d += 'Z';

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'web-silk');

    group.appendChild(path);
  }

  webSvg.appendChild(group);
  document.body.appendChild(webSvg);

  webDrawn = false;
}

function triggerWebDraw() {
  if (!webSvg || webDrawn) return;

  webDrawn = true;

  const elements = Array.from(
    webSvg.querySelectorAll<SVGLineElement | SVGPathElement>('.web-silk')
  );

  const spokeCount = 24;

  elements.forEach((el, i) => {
    const length = el.getTotalLength();

    el.style.strokeDasharray = String(length);
    el.style.strokeDashoffset = String(length);

    const isSpoke = i < spokeCount;
    const delay = isSpoke
      ? i * 35
      : 1800 + (i - spokeCount) * 350;

    const animation = el.animate(
      [
        { strokeDashoffset: length },
        { strokeDashoffset: 0 },
      ],
      {
        duration: isSpoke ? 1400 : 1200,
        delay,
        easing: 'ease-in-out',
        fill: 'forwards',
      }
    );

    webAnimations.push(animation);
  });
}


function setPetPos(corner: string) {
  if (!petEl) return;
  const p = getCornerPos(corner);
  petEl.style.left = `${p.x}px`;
  petEl.style.top = `${p.y}px`;
}

function resetIdle(cleanupFns: (() => void)[]) {
  if (idleTimer) clearTimeout(idleTimer);

  if (isIdle) {
    isIdle = false;

    if (walkTimer) clearTimeout(walkTimer);
    if (webDrawTimer) clearTimeout(webDrawTimer);

    walkTimer = null;
    webDrawTimer = null;

    webAnimations.forEach(animation => animation.cancel());
    webAnimations = [];

    webSvg?.remove();
    webSvg = null;
    webDrawn = false;

    if (petEl) {
      petEl.style.opacity = '0';

      setTimeout(() => {
        if (!petEl) return;

        petEl.style.transition = 'none';
        currentCorner = 'RB';
        setPetPos('RB');

        void petEl.offsetWidth;

        petEl.style.transition = 'left 10s linear, top 10s linear, opacity 0.3s ease';
        petEl.style.opacity = '1';
      }, 300);
    }
  }

  idleTimer = setTimeout(() => {
    isIdle = true;
    walkSequence();
  }, 30000);
}

function walkSequence() {
  if (!isIdle || !petEl) return;
  const petType = (petEl as any).dataset.type || 'cat';
  
if (petType === 'spider') {
  if (!webSvg) {
    createWebSVG();

    petEl.style.transition = 'left 2s ease-in-out, top 2s ease-in-out';

    const center = getCornerPos('CENTER');
    petEl.style.left = `${center.x}px`;
    petEl.style.top = `${center.y}px`;
    currentCorner = 'CENTER';

    webDrawTimer = setTimeout(() => {
      triggerWebDraw();
      webDrawTimer = null;
    }, 2000);

    walkTimer = setTimeout(walkSequence, 12000);
  } else {
    const corners = ['LT', 'RT', 'LB', 'RB', 'CENTER'];
    const next = corners[Math.floor(Math.random() * corners.length)];

    petEl.style.transition = 'left 3s ease-in-out, top 3s ease-in-out';
    setPetPos(next);
    currentCorner = next;

    walkTimer = setTimeout(walkSequence, 6000);
  }

  return;
}

  const walkDuration = petType === 'snail' ? 35 : petType === 'spiderman' ? 7 : 10;
  
  if (petType === 'spiderman') {
    // (Spiderman logic same as before)
    const seq = ['RT', 'RB', 'RT', 'LT', 'LB', 'LT']; 
    let idx = seq.indexOf(currentCorner);
    if (idx === -1) idx = 0; 
    currentCorner = seq[(idx + 1) % seq.length];
    setPetPos(currentCorner);
    walkTimer = setTimeout(walkSequence, 7000);
    return;
  }

  petEl.style.transition = `left ${walkDuration}s linear, top ${walkDuration}s linear, opacity 0.3s ease`;
  const seq = ['RB', 'LB', 'LT', 'RT'];
  let idx = seq.indexOf(currentCorner);
  if (idx === -1) idx = 0;
  currentCorner = seq[(idx + 1) % seq.length];
  setPetPos(currentCorner);
  walkTimer = setTimeout(walkSequence, walkDuration * 1000);
}

export function mountPet(s: Settings, cleanupFns: (() => void)[]) {
  removePet();
  if (!s.pet.enabled) return;
  
  petEl = document.createElement('div');
  petEl.className = 'pibblora-pet-container';
  Object.assign(petEl.style, {
  position: 'fixed',
  zIndex: '2147483640',
  pointerEvents: 'none',
});
  (petEl as any).dataset.type = s.pet.type;
  
  const img = document.createElement('img');
  img.src = PET_ICONS[s.pet.type] || PET_ICONS.cat;
  img.style.width = `${s.pet.size}px`;
  img.style.height = 'auto';
  img.style.objectFit = 'contain';
  
  const inner = document.createElement('div');
  inner.className = 'pibblora-pet-inner';
  inner.appendChild(img);
  inner.style.animation = `pibblora-${s.pet.animation} 2.2s ease-in-out infinite`;
  
  petEl.appendChild(inner);
  document.body.appendChild(petEl);

  currentCorner = 'RB';
  setPetPos('RB');
  
  setTimeout(() => { if (petEl) petEl.style.opacity = '1'; }, 100);
  idleTimer = setTimeout(() => { isIdle = true; walkSequence(); }, 30000);
  
  const events = ['mousemove', 'mousedown', 'scroll', 'keydown', 'touchstart'];
  const handler = () => resetIdle(cleanupFns);
  events.forEach(e => window.addEventListener(e, handler, { passive: true }));
  cleanupFns.push(() => events.forEach(e => window.removeEventListener(e, handler)));
}

export function removePet() {
  if (idleTimer) clearTimeout(idleTimer);
  if (walkTimer) clearTimeout(walkTimer);
  if (webDrawTimer) clearTimeout(webDrawTimer);

  idleTimer = null;
  walkTimer = null;
  webDrawTimer = null;

  webAnimations.forEach(animation => animation.cancel());
  webAnimations = [];

  petEl?.remove();
  petEl = null;

  webSvg?.remove();
  webSvg = null;

  webDrawn = false;
  isIdle = false;
}