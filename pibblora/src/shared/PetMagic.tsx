import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "./StoreContext";
import { petIcons, presets } from "./theme";
import SpiderWeb from "./pet-magic/SpiderWeb";
import { useSpiderCrawler } from "./pet-magic/useSpiderCrawler";

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
    case "CENTER":
      return { x: w / 2 - 32, y: h / 2 - 32 };
    default:
      return { x: 0, y: 0 };
  }
};

export default function PetMagic() {
  const { settings } = useStore();

  const [isIdle, setIsIdle] = useState(false);
  const [pos, setPos] = useState(() => getCornerPos("RB"));
  const [fade, setFade] = useState(0);
  const [isTeleporting, setIsTeleporting] = useState(false);
  const [webPhase, setWebPhase] = useState(0);

  const currentCorner = useRef("RB");
  const walkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const crawlElement = useRef<HTMLDivElement>(null);

  const webColor =
    presets[settings.theme.preset]?.primary || "#C9B6FF";

  const isSpiderActive =
    isIdle &&
    settings.pet.enabled &&
    settings.pet.type === "spider";

  const { start: startSpider, stop: stopSpider } = useSpiderCrawler({
    active: isSpiderActive,
    crawlElement
  });

  useEffect(() => {
    const timer = setTimeout(() => setFade(1), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setPos(getCornerPos(isIdle ? currentCorner.current : "RB"));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isIdle]);

  const resetIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);

    if (isIdle) {
      setIsIdle(false);

      if (walkTimer.current) {
        clearTimeout(walkTimer.current);
        walkTimer.current = null;
      }

      stopSpider();

      currentCorner.current = "RB";

      setFade(0);
      setWebPhase(0);

      if (crawlElement.current) {
        const resetPosition = getCornerPos("RB");
        crawlElement.current.style.left = `${resetPosition.x}px`;
        crawlElement.current.style.top = `${resetPosition.y}px`;
      }

      setTimeout(() => {
        currentCorner.current = "RB";
        setPos(getCornerPos("RB"));
        setTimeout(() => setFade(1), 50);
      }, 300);
    }

    idleTimer.current = setTimeout(() => setIsIdle(true), 30000);
  }, [isIdle, stopSpider]);

  useEffect(() => {
    if (!isIdle || !settings.pet.enabled) return;

    let cancelled = false;

    const walkSequence = () => {
      if (cancelled) return;

      const duration =
        settings.pet.type === "spiderman"
          ? 7000
          : settings.pet.type === "snail"
            ? 35000
            : 10000;

      if (settings.pet.type === "spiderman") {
        const seq = ["RT", "RB", "RT", "LT", "LB", "LT"];
        let idx = seq.indexOf(currentCorner.current);

        if (idx === -1) idx = 0;

        currentCorner.current = seq[(idx + 1) % seq.length];
        setPos(getCornerPos(currentCorner.current));
        walkTimer.current = setTimeout(walkSequence, duration);
        return;
      }

      const roll = Math.random();

      const action =
        settings.pet.type === "snail"
          ? roll < 0.5
            ? "reverse"
            : "forward"
          : roll < 0.4
            ? "reverse"
            : roll < 0.7
              ? "teleport"
              : "forward";

      if (action === "teleport") {
        setFade(0);

        walkTimer.current = setTimeout(() => {
          if (cancelled) return;

          const corners = ["RB", "LB", "LT", "RT"];

          currentCorner.current =
            corners[Math.floor(Math.random() * corners.length)];

          setPos(getCornerPos(currentCorner.current));
          setFade(1);
          walkTimer.current = setTimeout(walkSequence, duration);
        }, 300);
      } else {
        const seq = ["RB", "LB", "LT", "RT"];
        let idx = seq.indexOf(currentCorner.current);

        if (idx === -1) idx = 0;

        idx =
          action === "forward"
            ? (idx + 1) % seq.length
            : (idx - 1 + seq.length) % seq.length;

        currentCorner.current = seq[idx];
        setPos(getCornerPos(currentCorner.current));
        walkTimer.current = setTimeout(walkSequence, duration);
      }
    };

    if (settings.pet.type === "spider") {
      walkTimer.current = setTimeout(() => {
        if (cancelled) return;

        const center = {
          x: window.innerWidth / 2 - settings.pet.size / 2,
          y: window.innerHeight / 2 - settings.pet.size / 2
        };

        if (crawlElement.current) {
          crawlElement.current.style.left = `${center.x}px`;
          crawlElement.current.style.top = `${center.y}px`;
        }

        currentCorner.current = "CENTER";

        walkTimer.current = setTimeout(() => {
          if (cancelled) return;

          setWebPhase(1);

          walkTimer.current = setTimeout(() => {
            if (cancelled) return;

            setWebPhase(2);

            walkTimer.current = setTimeout(() => {
              if (!cancelled) startSpider();
            }, 6500);
          }, 2000);
        }, 2000);
      }, 10000);
    } else {
      walkTimer.current = setTimeout(walkSequence, 10000);
    }

    return () => {
      cancelled = true;

      if (walkTimer.current) {
        clearTimeout(walkTimer.current);
        walkTimer.current = null;
      }

      stopSpider();
    };
  }, [
    isIdle,
    settings.pet.enabled,
    settings.pet.type,
    settings.pet.size,
    startSpider,
    stopSpider
  ]);

  useEffect(() => {
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (walkTimer.current) clearTimeout(walkTimer.current);
    };
  }, []);

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
      : settings.pet.type === "spiderman"
        ? 7
        : 10;

  return (
    <>
      {settings.pet.type === "spider" && (
        <SpiderWeb color={webColor} phase={webPhase} />
      )}

      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          pointerEvents: "none",
          zIndex: 50
        }}
      >
        {settings.pet.type === "spider" ? (
          <div
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              width: settings.pet.size,
              pointerEvents: "none",
              zIndex: 51,
              opacity: fade
            }}
          >
            <div
              ref={crawlElement}
              style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                width: settings.pet.size,
                pointerEvents: "none"
              }}
            >
              <motion.div
                animate={animate}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.2))"
                }}
              >
                <img
                  src={iconSrc}
                  alt="spider"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain"
                  }}
                />
              </motion.div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={false}
            animate={{
              x: pos.x,
              y: pos.y,
              opacity: fade
            }}
            transition={{
              x: {
                duration: isTeleporting ? 0 : walkDuration,
                ease: "linear"
              },
              y: {
                duration: isTeleporting ? 0 : walkDuration,
                ease: "linear"
              },
              opacity: { duration: 0.3 }
            }}
          >
            <motion.div
              animate={animate}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.2))"
              }}
            >
              <img
                src={iconSrc}
                alt={settings.pet.type}
                style={{
                  width: settings.pet.size,
                  height: "auto",
                  objectFit: "contain"
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}