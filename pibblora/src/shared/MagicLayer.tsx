import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "./StoreContext";
import { petIcons, cursorEmoji } from "./theme";

const getCornerPos = (corner: string) => {
  const margin = 40;
  const w = window.innerWidth;
  const h = window.innerHeight;
  switch (corner) {
    case "RB":
      return { x: w - 100 - margin, y: h - 100 - margin };
    case "LB":
      return { x: margin, y: h - 100 - margin };
    case "LT":
      return { x: margin, y: margin };
    case "RT":
      return { x: w - 100 - margin, y: margin };
    default:
      return { x: 0, y: 0 };
  }
};

export function MagicLayer() {
  const { settings } = useStore();

  const [isIdle, setIsIdle] = useState(false);
  const [pos, setPos] = useState(() => getCornerPos("RB"));
  const [fade, setFade] = useState(0);
  const [isTeleporting, setIsTeleporting] = useState(false);
  const currentCorner = useRef("RB");
  const walkTimer = useRef<any>(null);
  const idleTimer = useRef<any>(null);

  useEffect(() => {
    const t = setTimeout(() => setFade(1), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleResize = () =>
      setPos(getCornerPos(isIdle ? currentCorner.current : "RB"));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isIdle]);

  const resetIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (isIdle) {
      setIsIdle(false);
      if (walkTimer.current) clearTimeout(walkTimer.current);

      setFade(0);
      setTimeout(() => {
        setIsTeleporting(true);
        currentCorner.current = "RB";
        setPos(getCornerPos("RB"));
        setTimeout(() => {
          setFade(1);
          setIsTeleporting(false);
        }, 50);
      }, 300);
    }
    idleTimer.current = setTimeout(() => setIsIdle(true), 30000);
  }, [isIdle]);

  useEffect(() => {
    if (!settings.pet.enabled) return;
    const events = [
      "mousemove",
      "mousedown",
      "scroll",
      "keydown",
      "touchstart",
    ];
    events.forEach((e) => window.addEventListener(e, resetIdle));
    resetIdle();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdle));
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (walkTimer.current) clearTimeout(walkTimer.current);
    };
  }, [resetIdle, settings.pet.enabled]);

  useEffect(() => {
    if (!isIdle || !settings.pet.enabled) return;

    const walkSequence = () => {
      const duration =
        settings.pet.type === "spiderman"
          ? 7000
          : settings.pet.type === "snail"
            ? 35000
            : 10000;

      // SpiderMan: Top to bottom bounce on left and right sides
      if (settings.pet.type === "spiderman") {
        const seq = ["RT", "RB", "RT", "LT", "LB", "LT"];
        let idx = seq.indexOf(currentCorner.current);
        if (idx === -1) idx = 0;

        idx = (idx + 1) % seq.length;
        currentCorner.current = seq[idx];
        setPos(getCornerPos(currentCorner.current));
        walkTimer.current = setTimeout(walkSequence, duration);
        return;
      }

      // Other pets random logic
      const roll = Math.random();
      const action =
        roll < 0.4 ? "reverse" : roll < 0.7 ? "teleport" : "forward";

      if (action === "teleport") {
        setFade(0);
        setIsTeleporting(true);
        walkTimer.current = setTimeout(() => {
          const corners = ["RB", "LB", "LT", "RT"];
          currentCorner.current =
            corners[Math.floor(Math.random() * corners.length)];
          setPos(getCornerPos(currentCorner.current));
          setFade(1);
          setIsTeleporting(false);
          walkTimer.current = setTimeout(walkSequence, duration);
        }, 300);
      } else {
        const seq = ["RB", "LB", "LT", "RT"];
        let idx = seq.indexOf(currentCorner.current);
        if (action === "forward") idx = (idx + 1) % seq.length;
        else idx = (idx - 1 + seq.length) % seq.length;

        currentCorner.current = seq[idx];
        setPos(getCornerPos(currentCorner.current));
        walkTimer.current = setTimeout(walkSequence, duration);
      }
    };
    walkTimer.current = setTimeout(walkSequence, 10000);
    return () => {
      if (walkTimer.current) clearTimeout(walkTimer.current);
    };
  }, [isIdle, settings.pet.enabled, settings.pet.type]);

  // Cursor Magic Logic
  useEffect(() => {
    if (!settings.cursor.enabled) return;

    let mainCursorEl: HTMLDivElement | null = null;
    let styleEl: HTMLStyleElement | null = null;
    let dualCounter = 0;

    if (settings.cursor.customCursor) {
      styleEl = document.createElement("style");
      styleEl.innerHTML = "* { cursor: none !important; }";
      document.head.appendChild(styleEl);

      mainCursorEl = document.createElement("div");
      Object.assign(mainCursorEl.style, {
        position: "fixed",
        left: "0",
        top: "0",
        pointerEvents: "none",
        zIndex: "999999",
        transform: "translate3d(0,0,0) translate(-50%, -50%)",
        borderRadius: "50%",
        background: settings.cursor.color.startsWith("#")
          ? settings.cursor.color
          : "#C9B6FF",
        width: `${settings.cursor.size * 0.6}px`,
        height: `${settings.cursor.size * 0.6}px`,
        transition: "width 0.2s, height 0.2s",
        willChange: "transform",
      });
      document.body.appendChild(mainCursorEl);
    }

    const onClick = (e: MouseEvent) => {
      const ripple = document.createElement("div");
      Object.assign(ripple.style, {
        position: "fixed",
        left: "0",
        top: "0",
        transform: `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(1)`,
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        border: `2px solid ${settings.cursor.color.includes("gradient") ? "var(--c-primary)" : settings.cursor.color}`,
        pointerEvents: "none",
        zIndex: "999999",
        transition: "all 0.5s ease-out",
        willChange: "transform, opacity",
      });
      document.body.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(4)`;
        ripple.style.opacity = "0";
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
      if (now - lastTime < 30) return; // Throttle
      lastTime = now;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      let steps = Math.max(1, Math.floor(distance / 15));
      if (steps > 5) steps = 5;

      for (let i = 1; i <= steps; i++) {
        const x = lastX + (dx * i) / steps;
        const y = lastY + (dy * i) / steps;

        const startColor = settings.cursor.color;
        const endColor = settings.cursor.dualColor
          ? settings.cursor.color2
          : settings.cursor.color;

        const dot = document.createElement("div");

        let extraStyles = {};
        if (settings.cursor.style === "neon") {
          extraStyles = {
            width: `${settings.cursor.size}px`,
            height: `${settings.cursor.size}px`,
            borderRadius: "50%",
            background: startColor,
            boxShadow: `0 0 15px ${startColor}, 0 0 30px ${startColor}`,
          };
        } else if (settings.cursor.style === "trail") {
          extraStyles = {
            width: `${settings.cursor.size * 0.4}px`,
            height: `${settings.cursor.size * 0.4}px`,
            borderRadius: "50%",
            background: startColor.includes("gradient")
              ? "#C9B6FF"
              : startColor,
          };
        } else {
          dot.textContent = cursorEmoji[settings.cursor.style] || "✨";
          extraStyles = {
            fontSize: `${settings.cursor.size}px`,
            color: startColor.includes("gradient") ? "#C9B6FF" : startColor,
          };
        }

        Object.assign(dot.style, {
          position: "fixed",
          left: "0",
          top: "0",
          transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`,
          pointerEvents: "none",
          zIndex: "999998",
          // Added color transitions here
          transition:
            "opacity 0.6s ease, transform 0.6s ease, background-color 0.6s ease, box-shadow 0.6s ease, color 0.6s ease",
          willChange: "transform, opacity",
          ...extraStyles,
        });

        document.body.appendChild(dot);
        void dot.offsetWidth;

        requestAnimationFrame(() => {
          dot.style.opacity = "0";
          dot.style.transform = `translate3d(${x}px, ${y - 30}px, 0) translate(-50%, -50%) scale(0.5)`;

          // Smoothly transition to second color
          if (settings.cursor.dualColor) {
            if (settings.cursor.style === "neon") {
              dot.style.background = endColor;
              dot.style.boxShadow = `0 0 15px ${endColor}, 0 0 30px ${endColor}`;
            } else if (settings.cursor.style === "trail") {
              dot.style.background = endColor.includes("gradient")
                ? "#C9B6FF"
                : endColor;
            } else {
              dot.style.color = endColor.includes("gradient")
                ? "#C9B6FF"
                : endColor;
            }
          }
        });
        setTimeout(() => dot.remove(), 700);
      }

      lastX = e.clientX;
      lastY = e.clientY;
    };

    window.addEventListener("click", onClick);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("mousemove", onMove);
      if (mainCursorEl) mainCursorEl.remove();
      if (styleEl) styleEl.remove();
    };
  }, [settings.cursor]);

  if (!settings.pet.enabled) return null;

  const animate =
    settings.pet.animation === "bounce"
      ? { y: [0, -20, 0] }
      : settings.pet.animation === "float"
        ? { y: [0, -10, 0], rotate: [-5, 5, -5] }
        : { rotate: [-15, 15, -15] };
  const iconSrc = settings.pet.customImage
    ? settings.pet.customImage
    : petIcons[settings.pet.type]?.src;
  const walkDuration =
    settings.pet.type === "snail"
      ? 35
      : settings.pet.type === "spider"
        ? 5
        : settings.pet.type === "spiderman"
          ? 7
          : 10;

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      <motion.div
        animate={{ x: pos.x, y: pos.y, opacity: fade }}
        transition={{
          x: {
            duration: isTeleporting
              ? 0
              : settings.pet.type === "spiderman"
                ? 1.5
                : walkDuration,
            ease: "linear",
          },
          y: {
            duration: isTeleporting
              ? 0
              : settings.pet.type === "spiderman"
                ? 1.5
                : walkDuration,
            ease:
              settings.pet.type === "spiderman"
                ? [0.68, -0.55, 0.265, 1.55]
                : "linear",
          },
          opacity: { duration: 0.3 },
        }}
      >
        <motion.div
          animate={animate}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.2))" }}
        >
          <img
            src={iconSrc}
            alt={settings.pet.type}
            style={{
              width: settings.pet.size,
              height: "auto",
              objectFit: "contain",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
