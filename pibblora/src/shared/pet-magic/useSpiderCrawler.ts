import { useCallback, useEffect, useRef } from "react";
import { buildSpiderGraph } from "./spiderGraph";
import type { SpiderGraph } from "./types";

type UseSpiderCrawlerProps = {
  active: boolean;
  crawlElement: React.RefObject<HTMLDivElement | null>;
};

export function useSpiderCrawler({
  active,
  crawlElement
}: UseSpiderCrawlerProps) {
  const crawlFrame = useRef<number | null>(null);
  const walkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spiderNode = useRef("CENTER");
  const previousSpiderEdge = useRef("");
  const spiderGraph = useRef<SpiderGraph | null>(null);
  const cancelled = useRef(false);

  const stop = useCallback(() => {
    cancelled.current = true;

    if (walkTimer.current) {
      clearTimeout(walkTimer.current);
      walkTimer.current = null;
    }

    if (crawlFrame.current !== null) {
      cancelAnimationFrame(crawlFrame.current);
      crawlFrame.current = null;
    }

    spiderGraph.current = null;
    spiderNode.current = "CENTER";
    previousSpiderEdge.current = "";
  }, []);

  useEffect(() => {
    cancelled.current = !active;

    if (!active) {
      stop();
      return;
    }

    cancelled.current = false;

    return () => {
      stop();
    };
  }, [active, stop]);

  const moveSpider = useCallback(() => {
    const spider = crawlElement.current;

    if (cancelled.current || !spider) return;

    if (!spiderGraph.current) {
      spiderGraph.current = buildSpiderGraph();
    }

    const graph = spiderGraph.current;

    if (!graph || !graph.size) {
      walkTimer.current = setTimeout(moveSpider, 300);
      return;
    }

    const spokes = document.querySelector<SVGGeometryElement>(
      ".spider-web-spoke"
    );

    const svg = spokes?.ownerSVGElement;

    if (!svg) {
      walkTimer.current = setTimeout(moveSpider, 300);
      return;
    }

    const currentNode = spiderNode.current;
    const available = graph.get(currentNode) || [];

    if (!available.length) {
      spiderNode.current = "CENTER";
      walkTimer.current = setTimeout(moveSpider, 100);
      return;
    }

    const choices = available.filter(
      edge => edge.id !== previousSpiderEdge.current
    );

    const options = choices.length ? choices : available;
    const selected = options[Math.floor(Math.random() * options.length)];

    previousSpiderEdge.current = selected.id;
    spiderNode.current = selected.next;

    const distance = Math.abs(selected.to - selected.from);
    const duration = Math.max(900, distance * 9);
    const startTime = performance.now();

    const animateSpider = (now: number) => {
      if (cancelled.current || !crawlElement.current) {
        crawlFrame.current = null;
        return;
      }

      const progress = Math.min((now - startTime) / duration, 1);
      const eased = progress * progress * (3 - 2 * progress);

      const rawLength =
        selected.from + (selected.to - selected.from) * eased;

      const length =
        ((rawLength % selected.total) + selected.total) %
        selected.total;

      const point = selected.element.getPointAtLength(length);
      const currentMatrix = svg.getScreenCTM();

      if (!currentMatrix) {
        crawlFrame.current = null;
        return;
      }

      const screenPoint = new DOMPoint(point.x, point.y)
        .matrixTransform(currentMatrix);

      const pet = crawlElement.current;

      pet.style.left = `${screenPoint.x - pet.offsetWidth / 2}px`;
      pet.style.top = `${screenPoint.y - pet.offsetHeight / 2}px`;

      if (progress < 1) {
        crawlFrame.current = requestAnimationFrame(animateSpider);
      } else {
        crawlFrame.current = null;
        walkTimer.current = setTimeout(moveSpider, 30);
      }
    };

    crawlFrame.current = requestAnimationFrame(animateSpider);
  }, [crawlElement]);

const start = useCallback(() => {
  cancelled.current = false;
  if (walkTimer.current) {
    clearTimeout(walkTimer.current);
    walkTimer.current = null;
  }
  moveSpider();
}, [moveSpider]);

  return { start, stop };
}