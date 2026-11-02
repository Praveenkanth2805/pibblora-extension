
import type {
  SpiderGraph,
  SpiderIntersection,
  SpiderNodePoint
} from "./types";

const SAMPLE_STEP = 6;
const MAX_DISTANCE_SQUARED = 64;

export function buildSpiderGraph(): SpiderGraph | null {
  const spokes = Array.from(
    document.querySelectorAll<SVGGeometryElement>(".spider-web-spoke")
  );

  const rings = Array.from(
    document.querySelectorAll<SVGGeometryElement>(".spider-web-ring")
  );

  if (!spokes.length || !rings.length) return null;

  // Calculate ring geometry only once.
  const ringSamples = rings.map(ring => {
    const total = ring.getTotalLength();
    const points: { length: number; x: number; y: number }[] = [];

    for (let length = 0; length < total; length += SAMPLE_STEP) {
      const point = ring.getPointAtLength(length);
      points.push({
        length,
        x: point.x,
        y: point.y
      });
    }

    const end = ring.getPointAtLength(total);
    points.push({
      length: total,
      x: end.x,
      y: end.y
    });

    return { total, points };
  });

  const graph: SpiderGraph = new Map();

  const addEdge = (
    fromNode: string,
    toNode: string,
    element: SVGGeometryElement,
    from: number,
    to: number,
    id: string
  ) => {
    const total = element.getTotalLength();

    if (!graph.has(fromNode)) graph.set(fromNode, []);
    if (!graph.has(toNode)) graph.set(toNode, []);

    graph.get(fromNode)!.push({
      id,
      element,
      from,
      to,
      next: toNode,
      total
    });

    graph.get(toNode)!.push({
      id,
      element,
      from: to,
      to: from,
      next: fromNode,
      total
    });
  };

  const intersections = new Map<string, SpiderIntersection>();

  spokes.forEach((spoke, si) => {
    const spokeTotal = spoke.getTotalLength();
    const start = spoke.getPointAtLength(0);
    const end = spoke.getPointAtLength(spokeTotal);

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lineLengthSquared = dx * dx + dy * dy;

    if (!lineLengthSquared) return;

    ringSamples.forEach(({ points }, ri) => {
      let bestDistanceSquared = Infinity;
      let bestSpokeLength = 0;
      let bestRingLength = 0;

      for (const ringPoint of points) {
        const projection =
          ((ringPoint.x - start.x) * dx +
            (ringPoint.y - start.y) * dy) /
          lineLengthSquared;

        const clamped = Math.max(0, Math.min(1, projection));

        const spokeX = start.x + dx * clamped;
        const spokeY = start.y + dy * clamped;

        const diffX = ringPoint.x - spokeX;
        const diffY = ringPoint.y - spokeY;
        const distanceSquared = diffX * diffX + diffY * diffY;

        if (distanceSquared < bestDistanceSquared) {
          bestDistanceSquared = distanceSquared;
          bestSpokeLength = clamped * spokeTotal;
          bestRingLength = ringPoint.length;
        }
      }

      if (bestDistanceSquared <= MAX_DISTANCE_SQUARED) {
        intersections.set(`${si}-${ri}`, {
          spokeLength: bestSpokeLength,
          ringLength: bestRingLength
        });
      }
    });
  });

  spokes.forEach((spoke, si) => {
    const total = spoke.getTotalLength();

    const points: SpiderNodePoint[] = [
      { node: "CENTER", length: 0 },
      ...rings
        .map((_, ri) => {
          const intersection = intersections.get(`${si}-${ri}`);

          return intersection
            ? {
                node: `J-${si}-${ri}`,
                length: intersection.spokeLength
              }
            : null;
        })
        .filter(
          (point): point is SpiderNodePoint => point !== null
        ),
      { node: `END-${si}`, length: total }
    ].sort((a, b) => a.length - b.length);

    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];

      if (b.length - a.length < 1) continue;

      addEdge(
        a.node,
        b.node,
        spoke,
        a.length,
        b.length,
        `spoke-${si}-${i}`
      );
    }
  });

  rings.forEach((ring, ri) => {
    const total = ringSamples[ri].total;

    const points: SpiderNodePoint[] = spokes
      .map((_, si) => {
        const intersection = intersections.get(`${si}-${ri}`);

        return intersection
          ? {
              node: `J-${si}-${ri}`,
              length: intersection.ringLength
            }
          : null;
      })
      .filter(
        (point): point is SpiderNodePoint => point !== null
      )
      .sort((a, b) => a.length - b.length);

    if (points.length < 2) return;

    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      const b = points[(i + 1) % points.length];

      const endLength =
        i === points.length - 1
          ? b.length + total
          : b.length;

      if (endLength - a.length < 1) continue;

      addEdge(
        a.node,
        b.node,
        ring,
        a.length,
        endLength,
        `ring-${ri}-${i}`
      );
    }
  });

  return graph;
}
