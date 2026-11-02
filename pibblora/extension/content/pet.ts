import { Settings, PET_ICONS } from './types';
import { getWebColor } from './theme';

let petEl: HTMLElement | null = null;
let webSvg: SVGSVGElement | null = null;
let isIdle = false;
let idleTimer: any;
let walkTimer: any;
let currentCorner = 'RB';
let currentTheme = 'cream';

export function setTheme(preset: string) { currentTheme = preset; }

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
  const svgNS = "http://www.w3.org/2000/svg";
  webSvg = document.createElementNS(svgNS, "svg");
  webSvg.setAttribute('style', 'position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 2147483640;');
  
  const color = getWebColor(currentTheme);
  
  let svgContent = `<g stroke="${color}" stroke-width="1.5" fill="none">`;
  
  // X Lines
  svgContent += `<line class="web-line" x1="50%" y1="50%" x2="0%" y2="0%" style="stroke-dasharray: 2000; stroke-dashoffset: 2000; transition: stroke-dashoffset 1.5s ease-in-out;" />`;
  svgContent += `<line class="web-line" x1="50%" y1="50%" x2="100%" y2="0%" style="stroke-dasharray: 2000; stroke-dashoffset: 2000; transition: stroke-dashoffset 1.5s ease-in-out;" />`;
  svgContent += `<line class="web-line" x1="50%" y1="50%" x2="100%" y2="100%" style="stroke-dasharray: 2000; stroke-dashoffset: 2000; transition: stroke-dashoffset 1.5s ease-in-out;" />`;
  svgContent += `<line class="web-line" x1="50%" y1="50%" x2="0%" y2="100%" style="stroke-dasharray: 2000; stroke-dashoffset: 2000; transition: stroke-dashoffset 1.5s ease-in-out;" />`;
  
  // + Lines
  svgContent += `<line class="web-line" x1="50%" y1="50%" x2="50%" y2="0%" style="stroke-dasharray: 2000; stroke-dashoffset: 2000; transition: stroke-dashoffset 1.5s ease-in-out;" />`;
  svgContent += `<line class="web-line" x1="50%" y1="50%" x2="100%" y2="50%" style="stroke-dasharray: 2000; stroke-dashoffset: 2000; transition: stroke-dashoffset 1.5s ease-in-out;" />`;
  svgContent += `<line class="web-line" x1="50%" y1="50%" x2="50%" y2="100%" style="stroke-dasharray: 2000; stroke-dashoffset: 2000; transition: stroke-dashoffset 1.5s ease-in-out;" />`;
  svgContent += `<line class="web-line" x1="50%" y1="50%" x2="0%" y2="50%" style="stroke-dasharray: 2000; stroke-dashoffset: 2000; transition: stroke-dashoffset 1.5s ease-in-out;" />`;

  // O Rings
  const rings = [
    "50%,40% 57%,43% 60%,50% 57%,57% 50%,60% 43%,57% 40%,50% 43%,43%",
    "50%,25% 68%,32% 75%,50% 68%,68% 50%,75% 32%,68% 25%,50% 32%,32%",
    "50%,10% 80%,20% 90%,50% 80%,80% 50%,90% 20%,80% 10%,50% 20%,20%"
  ];
  rings.forEach((ring) => {
    svgContent += `<polygon class="web-ring" points="${ring}" style="stroke-dasharray: 2000; stroke-dashoffset: 2000; transition: stroke-dashoffset 2s ease-in-out;" />`;
  });

  svgContent += `</g>`;
  webSvg.innerHTML = svgContent;
  document.body.appendChild(webSvg);
}

function triggerWebDraw() {
  if (!webSvg) return;
  webSvg.querySelectorAll('.web-line').forEach((el: any, i) => {
    setTimeout(() => { el.style.strokeDashoffset = '0'; }, i * 200);
  });
  webSvg.querySelectorAll('.web-ring').forEach((el: any, i) => {
    setTimeout(() => { el.style.strokeDashoffset = '0'; }, 2000 + (i * 1500));
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
    if (webSvg) webSvg.innerHTML = ''; 

    if (petEl) {
      petEl.style.opacity = '0'; 
      setTimeout(() => {
        if (!petEl) return;
        petEl.style.transition = 'none'; 
        currentCorner = 'RB';
        setPetPos('RB');
        void petEl.offsetWidth; 
        petEl.style.transition = `left 10s linear, top 10s linear, opacity 0.3s ease`;
        petEl.style.opacity = '1';
      }, 300);
    }
  }
  idleTimer = setTimeout(() => { isIdle = true; walkSequence(); }, 30000);
}

function walkSequence() {
  if (!isIdle || !petEl) return;
  const petType = (petEl as any).dataset.type || 'cat';
  
  if (petType === 'spider') {
    if (!webSvg) {
      createWebSVG();
      petEl.style.transition = 'left 2s ease-in-out, top 2s ease-in-out';
      petEl.style.left = `${window.innerWidth/2 - 32}px`;
      petEl.style.top = `${window.innerHeight/2 - 32}px`;
      currentCorner = 'CENTER';
      setTimeout(triggerWebDraw, 2000);
      walkTimer = setTimeout(walkSequence, 12000);
    } else {
      const corners = ['LT', 'RT', 'LB', 'RB', 'CENTER'];
      const next = corners[Math.floor(Math.random() * corners.length)];
      petEl.style.transition = 'left 3s ease-in-out, top 3s ease-in-out';
      if (next === 'CENTER') {
        petEl.style.left = `${window.innerWidth/2 - 32}px`;
        petEl.style.top = `${window.innerHeight/2 - 32}px`;
      } else { setPetPos(next); }
      currentCorner = next;
      walkTimer = setTimeout(walkSequence, 5000);
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
  
  if (s.pet.type === 'spider') createWebSVG();

  petEl = document.createElement('div');
  petEl.className = 'pibblora-pet-container';
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
  petEl?.remove(); petEl = null; 
  if (webSvg) { webSvg.remove(); webSvg = null; }
}