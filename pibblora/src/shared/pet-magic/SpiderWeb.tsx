import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type SpiderWebProps = {
  color: string;
  phase: number;
};

export default function SpiderWeb({ color, phase }: SpiderWebProps) {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const resize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const { width, height } = size;
  const cx = width / 2;
  const cy = height / 2;
  const spokes = 28;
  const rings = 10;
  const radiusX = width * 0.49;
  const radiusY = height * 0.47;

  const boundary = Array.from({ length: spokes }, (_, i) => {
    const angle = (i / spokes) * Math.PI * 2;
    const variation = 1 + Math.sin(i * 2.17) * 0.018;

    return {
      x: cx + Math.cos(angle) * radiusX * variation,
      y: cy + Math.sin(angle) * radiusY * variation
    };
  });

  const ringPaths = Array.from({ length: rings }, (_, i) => {
    const progress = 0.12 + (i / rings) * 0.88;

    const points = boundary.map((point, j) => {
      const variation = 1 + Math.sin(j * 1.8 + i * 0.65) * 0.012;
      const scale = progress * variation;

      return {
        x: cx + (point.x - cx) * scale,
        y: cy + (point.y - cy) * scale
      };
    });

    let d = "";

    points.forEach((point, j) => {
      const next = points[(j + 1) % spokes];
      const midX = (point.x + next.x) / 2;
      const midY = (point.y + next.y) / 2;

      if (j === 0) d += `M ${midX} ${midY} `;
      d += `Q ${point.x} ${point.y} ${midX} ${midY} `;
    });

    return `${d}Z`;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 49,
        overflow: "hidden"
      }}
    >
      <g
        fill="none"
        stroke={color}
        strokeWidth="1.25"
        strokeOpacity="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 2px ${color})` }}
      >
        {boundary.map((point, i) => (
          <motion.line
            className="spider-web-silk spider-web-spoke"
            key={`silk-${i}`}
            x1={cx}
            y1={cy}
            x2={point.x}
            y2={point.y}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: phase >= 1 ? 1 : 0 }}
            transition={{
              duration: 1.4,
              delay: i * 0.035,
              ease: "easeInOut"
            }}
          />
        ))}

        {ringPaths.map((d, i) => (
          <motion.path
            className="spider-web-silk spider-web-ring"
            key={`spiral-${i}`}
            d={d}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: phase >= 2 ? 1 : 0,
              opacity: phase >= 2 ? 1 : 0
            }}
            transition={{
              pathLength: {
                duration: 1.2,
                delay: 1.8 + i * 0.35,
                ease: "easeInOut"
              },
              opacity: { duration: 0.2 }
            }}
          />
        ))}

        <motion.circle
          cx={cx}
          cy={cy}
          r="3"
          fill={color}
          stroke="none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: phase >= 1 ? 0.9 : 0,
            scale: phase >= 1 ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        />
      </g>
    </svg>
  );
}