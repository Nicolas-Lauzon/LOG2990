export enum arrayPos {
  OUTER_POINTS = 0, INNER_POINTS = 1,
  NB_SIDES = 0, STROKE_WIDTH = 1,
  START_POSITION_X = 0, START_POSITION_Y = 1,
  WIDTH = 0, HEIGHT = 1, RECT_HEIGHT = 2, RECT_WIDTH = 3,
  MAX_X = 0, MAX_Y = 1, MIN_X = 2, MIN_Y = 3,
  INNER_RAD = 0, OUTER_RAD = 1
}

const STARTING_SIDE_NUMBER = 3;

export class PolygonParameters {
  points: string[];
  attributes: number[];
  positions: number[];
  rectangleDimensions: number[];
  limitCoords: number[];
  radius: number[];
  inverseColors: boolean;

  constructor() {
    this.inverseColors = false;
    this.points = ['', ''];
    this.attributes = [STARTING_SIDE_NUMBER, 1];
    this.positions = [0, 0];
    this.rectangleDimensions = [0, 0, 0, 0];
    this.limitCoords = [0, 0, 0, 0];
    this.radius = [0, 0];
  }
}
