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
let crawlFrame: number | null = null;
let lastSilk: SVGGeometryElement | null = null;

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
  if (webSvg) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const width = window.innerWidth;
  const height = window.innerHeight;
  const cx = width / 2;
  const cy = height / 2;

const spokes = 28;
const rings = 10;
const radiusX = width * 0.49;
const radiusY = height * 0.47;

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
  group.setAttribute('opacity', '0');
  group.setAttribute('stroke-width', '1.25');
  group.setAttribute('stroke-opacity', '0.9');
  group.setAttribute('stroke-linecap', 'round');
  group.setAttribute('stroke-linejoin', 'round');
  group.style.filter = `drop-shadow(0 0 2px ${color})`;

  const boundary = Array.from({ length: spokes }, (_, i) => {
    const angle = (i / spokes) * Math.PI * 2;
    const variation = 1 + Math.sin(i * 2.17) * 0.018;

    return {
      x: cx + Math.cos(angle) * radiusX * variation,
      y: cy + Math.sin(angle) * radiusY * variation,
    };
  });

  // Radial support threads
  boundary.forEach(point => {
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', String(cx));
    line.setAttribute('y1', String(cy));
    line.setAttribute('x2', String(point.x));
    line.setAttribute('y2', String(point.y));
    line.setAttribute('class', 'web-silk');
    group.appendChild(line);
  });

  // Curved spiral connecting threads
  for (let i = 0; i < rings; i++) {
    const progress = 0.12 + (i / rings) * 0.88;

    const points = boundary.map((point, j) => {
      const variation = 1 + Math.sin(j * 1.8 + i * 0.65) * 0.012;
      const scale = progress * variation;

      return {
        x: cx + (point.x - cx) * scale,
        y: cy + (point.y - cy) * scale,
      };
    });

    let d = '';

    points.forEach((point, j) => {
      const next = points[(j + 1) % spokes];
      const midX = (point.x + next.x) / 2;
      const midY = (point.y + next.y) / 2;

      if (j === 0) d += `M ${midX} ${midY} `;

      d += `Q ${point.x} ${point.y} ${midX} ${midY} `;
    });

    d += 'Z';

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'web-silk');
    group.appendChild(path);
  }

  // Small central hub
  const hub = document.createElementNS(svgNS, 'circle');
  hub.setAttribute('cx', String(cx));
  hub.setAttribute('cy', String(cy));
  hub.setAttribute('r', '3');
  hub.setAttribute('fill', color);
  hub.setAttribute('stroke', 'none');
  hub.setAttribute('class', 'web-hub');
  group.appendChild(hub);

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

  const spokeCount = 28;

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
    const group = webSvg?.querySelector('g');
group?.setAttribute('opacity', '1');
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
if (crawlFrame !== null) {
  cancelAnimationFrame(crawlFrame);
  crawlFrame = null;
}

lastSilk = null;
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

function crawlOnWeb() {
  if (!isIdle || !petEl || !webSvg) return;

  const silkElements = Array.from(
    webSvg.querySelectorAll<SVGGeometryElement>('.web-silk')
  );

  if (!silkElements.length) return;

  const rect = petEl.getBoundingClientRect();
  const offsetX = rect.width / 2;
  const offsetY = rect.height / 2;

  const currentX = rect.left + offsetX;
  const currentY = rect.top + offsetY;

  const candidates: {
    element: SVGGeometryElement;
    length: number;
    point: DOMPoint;
    distance: number;
  }[] = [];

  silkElements.forEach(element => {
    const length = element.getTotalLength();

    if (!length) return;

    let nearestPoint: DOMPoint | null = null;
    let nearestLength = 0;
    let nearestDistance = Infinity;

    for (let i = 0; i <= length; i += 5) {
      const point = element.getPointAtLength(Math.min(i, length));
      const distance = Math.hypot(
        point.x - currentX,
        point.y - currentY
      );

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestPoint = point;
        nearestLength = Math.min(i, length);
      }
    }

    if (nearestPoint && nearestDistance <= 24) {
      candidates.push({
        element,
        length: nearestLength,
        point: nearestPoint,
        distance: nearestDistance
      });
    }
  });

  if (!candidates.length) return;

  const alternatives = candidates.filter(
    item => item.element !== lastSilk
  );

  const choices = alternatives.length ? alternatives : candidates;
  const selected = choices[Math.floor(Math.random() * choices.length)];

  const element = selected.element;
  const totalLength = element.getTotalLength();

  const direction = Math.random() > 0.5 ? 1 : -1;
  const startLength = selected.length;

  const endLength = direction === 1 ? totalLength : 0;
  const distance = Math.abs(endLength - startLength);

  if (distance < 5) {
    lastSilk = element;
    walkTimer = setTimeout(crawlOnWeb, 100);
    return;
  }

  lastSilk = element;

  const duration = Math.max(1200, distance * 18);
  const startTime = performance.now();

  const animate = (now: number) => {
    if (!isIdle || !petEl) {
      crawlFrame = null;
      return;
    }

    const progress = Math.min((now - startTime) / duration, 1);
    const eased = progress * progress * (3 - 2 * progress);

    const currentLength =
      startLength + (endLength - startLength) * eased;

    const point = element.getPointAtLength(currentLength);

    petEl.style.left = `${point.x - offsetX}px`;
    petEl.style.top = `${point.y - offsetY}px`;

    if (progress < 1) {
      crawlFrame = requestAnimationFrame(animate);
    } else {
      crawlFrame = null;
      walkTimer = setTimeout(crawlOnWeb, 80);
    }
  };

  crawlFrame = requestAnimationFrame(animate);
}

function walkSequence() {
  if (!isIdle || !petEl) return;
  const petType = (petEl as any).dataset.type || 'cat';
  
if (petType === 'spider') {
  if (!webSvg) {
    // Add smooth transition to center
    if (petEl) petEl.style.transition = 'left 2s ease-in-out, top 2s ease-in-out';
    setPetPos('CENTER');
    currentCorner = 'CENTER';

    walkTimer = setTimeout(() => {
      if (!isIdle) return;

      // Remove transition before web build and crawl
      if (petEl) petEl.style.transition = 'none';

      createWebSVG();
      triggerWebDraw();

      walkTimer = setTimeout(crawlOnWeb, 6500);
    }, 2000); // Wait 2s for spider to reach center
  } else {
    crawlOnWeb();
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

  if (crawlFrame !== null) {
  cancelAnimationFrame(crawlFrame);
  crawlFrame = null;
}

lastSilk = null;

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