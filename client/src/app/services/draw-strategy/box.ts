export enum INDEX {
  X = 0,
  Y = 1
}

export class Box {

  startPosition: number[];
  endPosition: number[];
  topLeft: number[];
  bottomRight: number[];
  dimensions: number[];
  lastDimensions: number[];

  constructor() {
    this.startPosition = [0, 0];
    this.endPosition = [0, 0];
    this.topLeft = [0, 0];
    this.bottomRight = [0, 0];
    this.dimensions = [0, 0];
    this.lastDimensions = [0, 0];
  }

  clone(): Box {
    const result = new Box();
    result.startPosition = Array.from(this.startPosition);
    result.endPosition =  Array.from(this.endPosition);
    result.topLeft =  Array.from(this.topLeft);
    result.bottomRight =  Array.from(this.bottomRight);
    result.dimensions =  Array.from(this.dimensions);
    result.lastDimensions =  Array.from(this.lastDimensions);

    return result;
  }
}
