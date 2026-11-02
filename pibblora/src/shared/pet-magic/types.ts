export type SpiderEdge = {
  id: string;
  element: SVGGeometryElement;
  from: number;
  to: number;
  next: string;
  total: number;
};

export type SpiderGraph = Map<string, SpiderEdge[]>;

export type SpiderNodePoint = {
  node: string;
  length: number;
};

export type SpiderIntersection = {
  spokeLength: number;
  ringLength: number;
};