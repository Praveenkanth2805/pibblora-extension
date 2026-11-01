interface Settings {
  theme: { preset: string };
  pet: { enabled: boolean; type: string; color: string; size: number; animation: string };
  cursor: { enabled: boolean; style: string; color: string; dualColor: boolean; color2: string; size: number; customCursor: boolean };
}

const DEFAULTS: Settings = {
  theme: { preset: 'cream' },
  pet: { enabled: false, type: 'cat', color: '#C9B6FF', size: 64, animation: 'bounce' },
  cursor: { enabled: false, style: 'stars', color: '#FFC9DE', dualColor: false, color2: '#C9B6FF', size: 18, customCursor: false },
};

// Locally hosted image for Spiderman
const SPIDERMAN_IMG = chrome.runtime.getURL('spider.png');

const PET_ICONS: Record<string, string> = {
  cat: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f431.svg',
  bunny: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f430.svg',
  star: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2b50.svg',
  blob: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f47e.svg',
  snail: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f40c.svg',
  spider: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f577.svg',
  spiderman: SPIDERMAN_IMG, 
  pikachu: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
};

const CURSOR_EMOJI: Record<string,string> = { stars: '✨', hearts: '💗', bubbles: '🫧', trail: '•', neon: '•' };
const KEY = 'pibblora:settings';

let petEl: HTMLElement | null = null;
let styleEl: HTMLStyleElement | null = null;
let cleanupFns: (() => void)[] = [];
let isIdle = false;
let idleTimer: any;
let walkTimer: any;
let currentCorner = 'RB';

function getCornerPos(corner: string) {
  const margin = 40;
  const w = window.innerWidth;
  const h = window.innerHeight;
  switch (corner) {
    case 'RB': return { x: w - 100 - margin, y: h - 100 - margin };
    case 'LB': return { x: margin, y: h - 100 - margin };
    case 'LT': return { x: margin, y: margin };
    case 'RT': return { x: w - 100 - margin, y: margin };
    default: return { x: 0, y: 0 };
  }
}

function injectStyle() {
  if (styleEl) return;
  styleEl = document.createElement('style');
  styleEl.id = 'pibblora-style';
  styleEl.textContent = `
    .pibblora-pet-container {
      position: fixed; top: 0; left: 0; z-index: 2147483646; pointer-events: none;
      opacity: 0; transition: opacity 0.3s ease;
    }
    .pibblora-pet-inner {
      filter: drop-shadow(0 6px 10px rgba(0,0,0,0.2)); user-select: none;
    }
    @keyframes pibblora-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
    @keyframes pibblora-float  { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-8px) rotate(3deg)} }
    @keyframes pibblora-wiggle { 0%,100%{transform:rotate(-10deg)} 50%{transform:rotate(10deg)} }
    .pibblora-cursor-dot {
      position: fixed; z-index: 2147483645; pointer-events: none;
      will-change: transform, opacity;
    }
  `;
  document.head.appendChild(styleEl);
}

function setPetPos(corner: string) {
  if (!petEl) return;
  const p = getCornerPos(corner);
  petEl.style.left = `${p.x}px`;
  petEl.style.top = `${p.y}px`;
}

function resetIdle() {
  if (idleTimer) clearTimeout(idleTimer);
  if (isIdle) {
    isIdle = false;
    if (walkTimer) clearTimeout(walkTimer);
    
    if (petEl) {
      petEl.style.opacity = '0'; 
      setTimeout(() => {
        if (!petEl) return;
        petEl.style.transition = 'none'; 
        currentCorner = 'RB';
        setPetPos('RB');
        void petEl.offsetWidth; 
        
        const petType = (petEl as any).dataset.type;
        const duration = petType === 'spiderman' ? 7 : 10;
        petEl.style.transition = `left ${duration}s linear, top ${duration}s linear, opacity 0.3s ease`;
        if (petEl) petEl.style.opacity = '1';
      }, 300);
    }
  }
  idleTimer = setTimeout(() => { isIdle = true; walkSequence(); }, 30000);
}

function walkSequence() {
  if (!isIdle || !petEl) return;
  const petType = (petEl as any).dataset.type || 'cat';
  
  const walkDuration = petType === 'snail' ? 35 : petType === 'spider' ? 5 : 10;

  if (petType === 'spiderman') {
    const roll = Math.random();
    let nextCorner = currentCorner;
    let isSwitchSide = false;

    if (currentCorner === 'RB') {
      if (roll < 0.5) nextCorner = 'RT';
      else { nextCorner = 'LB'; isSwitchSide = true; }
    } else if (currentCorner === 'RT') {
      if (roll < 0.5) nextCorner = 'RB';
      else { nextCorner = 'LT'; isSwitchSide = true; }
    } else if (currentCorner === 'LB') {
      if (roll < 0.5) nextCorner = 'LT';
      else { nextCorner = 'RB'; isSwitchSide = true; }
    } else if (currentCorner === 'LT') {
      if (roll < 0.5) nextCorner = 'LB';
      else { nextCorner = 'RT'; isSwitchSide = true; }
    }

    if (isSwitchSide) {
      petEl.style.opacity = '0';
      setTimeout(() => {
        if (!petEl) return;
        petEl.style.transition = 'none';
        currentCorner = nextCorner;
        setPetPos(currentCorner);
        void petEl.offsetWidth;
        petEl.style.opacity = '1';
        petEl.style.transition = `left 1.5s linear, top 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.3s ease`;
        walkTimer = setTimeout(walkSequence, 2500);
      }, 300);
    } else {
      petEl.style.transition = `left 1.5s linear, top 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.3s ease`;
      currentCorner = nextCorner;
      setPetPos(currentCorner);
      walkTimer = setTimeout(walkSequence, 3000);
    }
    return;
  }

  petEl.style.transition = `left ${walkDuration}s linear, top ${walkDuration}s linear, opacity 0.3s ease`;

  const roll = Math.random();
  const action = roll < 0.4 ? 'reverse' : roll < 0.7 ? 'teleport' : 'forward';

  if (action === 'teleport') {
    petEl.style.opacity = '0';
    setTimeout(() => {
      const corners = ['RB', 'LB', 'LT', 'RT'];
      currentCorner = corners[Math.floor(Math.random() * corners.length)];
      setPetPos(currentCorner);
      if (petEl) petEl.style.opacity = '1';
      walkTimer = setTimeout(walkSequence, walkDuration * 1000);
    }, 300);
  } else {
    const seq = ['RB', 'LB', 'LT', 'RT'];
    let idx = seq.indexOf(currentCorner);
    if (action === 'forward') idx = (idx + 1) % seq.length;
    else idx = (idx - 1 + seq.length) % seq.length;
    currentCorner = seq[idx];
    setPetPos(currentCorner);
    walkTimer = setTimeout(walkSequence, walkDuration * 1000);
  }
}

function mountPet(s: Settings) {
  removePet();
  if (!s.pet.enabled) return;
  petEl = document.createElement('div');
  petEl.className = 'pibblora-pet-container';
  (petEl as any).dataset.type = s.pet.type;
  
  const inner = document.createElement('div');
  inner.className = 'pibblora-pet-inner';
  
  const img = document.createElement('img');
  img.src = PET_ICONS[s.pet.type] || PET_ICONS.cat;
  img.style.width = `${s.pet.size}px`;
  img.style.height = 'auto';
  img.style.objectFit = 'contain';
  inner.appendChild(img);
  
  inner.style.animation = `pibblora-${s.pet.animation} 2.2s ease-in-out infinite`;
  petEl.appendChild(inner);
  document.body.appendChild(petEl);

  currentCorner = 'RB';
  setPetPos('RB');
  
  setTimeout(() => {
    if (petEl) petEl.style.opacity = '1';
  }, 100);

  idleTimer = setTimeout(() => { isIdle = true; walkSequence(); }, 30000);
  
  const events = ['mousemove', 'mousedown', 'scroll', 'keydown', 'touchstart'];
  events.forEach(e => window.addEventListener(e, resetIdle, { passive: true }));
  cleanupFns.push(() => events.forEach(e => window.removeEventListener(e, resetIdle)));
}

function removePet() { 
  if (idleTimer) clearTimeout(idleTimer);
  if (walkTimer) clearTimeout(walkTimer);
  cleanupFns.forEach(fn => fn());
  cleanupFns = [];
  petEl?.remove(); 
  petEl = null; 
}

function mountCursor(s: Settings) {
  if (!s.cursor.enabled) {
    document.body.style.cursor = 'auto';
    document.getElementById('pibblora-hide-cursor')?.remove();
    return;
  }

  let mainCursorEl: HTMLDivElement | null = null;
  let styleEl = document.getElementById('pibblora-hide-cursor');
  let dualCounter = 0;

  if (s.cursor.customCursor) {
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'pibblora-hide-cursor';
      styleEl.innerHTML = '* { cursor: none !important; }';
      document.head.appendChild(styleEl);
    }

    mainCursorEl = document.createElement('div');
    Object.assign(mainCursorEl.style, {
      position: 'fixed', left: '0', top: '0', pointerEvents: 'none', zIndex: '2147483647',
      transform: 'translate3d(0,0,0) translate(-50%, -50%)', borderRadius: '50%',
      background: s.cursor.color.startsWith('#') ? s.cursor.color : '#C9B6FF',
      width: `${s.cursor.size * 0.6}px`, height: `${s.cursor.size * 0.6}px`,
      transition: 'width 0.2s, height 0.2s',
      willChange: 'transform'
    });
    document.body.appendChild(mainCursorEl);
  } else {
    styleEl?.remove();
    document.body.style.cursor = 'auto';
  }

  const onClick = (e: MouseEvent) => {
    const ripple = document.createElement('div');
    Object.assign(ripple.style, {
      position: 'fixed', left: '0', top: '0',
      transform: `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(1)`,
      width: '20px', height: '20px', borderRadius: '50%',
      border: `2px solid ${s.cursor.color.includes('gradient') ? '#C9B6FF' : s.cursor.color}`, 
      pointerEvents: 'none', zIndex: '2147483647',
      transition: 'all 0.5s ease-out',
      willChange: 'transform, opacity'
    });
    document.body.appendChild(ripple);
    requestAnimationFrame(() => {
      ripple.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(4)`;
      ripple.style.opacity = '0';
    });
    setTimeout(() => ripple.remove(), 500);
  };

  let lastTime = 0;
  let lastX = 0;
  let lastY = 0;

  const onMove = (e: MouseEvent) => {
    if (mainCursorEl) {
      mainCursorEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    }

    const now = performance.now();
    if (now - lastTime < 30) return;
    lastTime = now;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let steps = Math.max(1, Math.floor(distance / 15));
    if (steps > 5) steps = 5; 

    for (let i = 1; i <= steps; i++) {
      const x = lastX + (dx * i) / steps;
      const y = lastY + (dy * i) / steps;

      // Dual Color Logic
      const activeColor = (s.cursor.dualColor && dualCounter % 2 === 0) 
        ? s.cursor.color2 
        : s.cursor.color;
      dualCounter++;

      const dot = document.createElement('div');
      
      let extraStyles = {};
      if (s.cursor.style === 'neon') {
        extraStyles = {
          width: `${s.cursor.size}px`, height: `${s.cursor.size}px`,
          borderRadius: '50%', background: activeColor,
          boxShadow: `0 0 15px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4)`
        };
      } else if (s.cursor.style === 'trail') {
        extraStyles = {
          width: `${s.cursor.size * 0.4}px`, height: `${s.cursor.size * 0.4}px`,
          borderRadius: '50%', background: activeColor.includes('gradient') ? '#C9B6FF' : activeColor
        };
      } else {
        dot.textContent = CURSOR_EMOJI[s.cursor.style] || '✨';
        extraStyles = {
          fontSize: `${s.cursor.size}px`, color: activeColor.includes('gradient') ? '#C9B6FF' : activeColor
        };
      }

      Object.assign(dot.style, {
        position: 'fixed', left: '0', top: '0',
        transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`,
        pointerEvents: 'none', zIndex: '2147483646',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        willChange: 'transform, opacity',
        ...extraStyles
      });
      
      document.body.appendChild(dot);
      void dot.offsetWidth; 

      requestAnimationFrame(() => {
        dot.style.opacity = '0';
        dot.style.transform = `translate3d(${x}px, ${y - 30}px, 0) translate(-50%, -50%) scale(0.4)`;
      });
      setTimeout(() => dot.remove(), 700);
    }

    lastX = e.clientX;
    lastY = e.clientY;
  };

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('click', onClick);
  
  cleanupFns.push(() => {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('click', onClick);
    if (mainCursorEl) mainCursorEl.remove();
    if (styleEl) styleEl.remove();
    document.body.style.cursor = 'auto';
  });
}

function applyTheme(preset: string) {
  const map: Record<string,string> = {
    lavender: '#F5F0FF', pink: '#FFF2F8', blue: '#EFF9FF',
    mint: '#EFFCF5', cream: '#FFF5E8', dark: '#1F1829', devotional: '#FFF8E7'
  };
  const existing = document.getElementById('pibblora-tint');
  existing?.remove();
  if (preset === 'cream') return;
  const tint = document.createElement('div');
  tint.id = 'pibblora-tint';
  tint.style.cssText = `
    position: fixed; inset: 0; pointer-events: none;
    z-index: 2147483644; mix-blend-mode: multiply;
    background: ${map[preset] ?? '#FFF5E8'};
    opacity: 0.12;
  `;
  document.documentElement.appendChild(tint);
}

function apply(s: Settings) {
  injectStyle();
  mountPet(s);
  mountCursor(s);
  applyTheme(s.theme.preset);
}

function teardown() {
  removePet();
  cleanupFns.forEach(fn => fn());
  cleanupFns = [];
  document.getElementById('pibblora-tint')?.remove();
}

async function getSettings(): Promise<Settings> {
  try {
    const r = await chrome.storage.local.get(KEY);
    return { ...DEFAULTS, ...(r[KEY] || {}) };
  } catch { return DEFAULTS; }
}

function init() {
  if ((window as any).__pibbloraInjected) return;
  (window as any).__pibbloraInjected = true;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}

async function boot() {
  const s = await getSettings();
  apply(s);

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes[KEY]?.newValue) {
      teardown();
      apply({ ...DEFAULTS, ...changes[KEY].newValue });
    }
  });
}

init();