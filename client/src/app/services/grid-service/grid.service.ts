import { Injectable } from '@angular/core';
import { DataService } from './../data-service/data.service';
import { DrawingService } from './../drawing-service/drawing.service';

const DEFAULT_SIZE = 20;
const DEFAULT_TRANSPARENCY = 0.1;
const DELAY = 50;
const MAX_SIZE = 100;
const MIN_SIZE = 5;
const INCREMENTS = 5;

@Injectable({
  providedIn: 'root'
})

export class GridService {
  size: number;
  isActive: boolean;
  private height: number;
  private width: number;
  transparency: number;
  private data: DataService;
  private drawing: DrawingService;

  constructor(data: DataService, drawing: DrawingService) {
    this.size = DEFAULT_SIZE;
    this.drawing = drawing;
    this.isActive = false;
    this.transparency = DEFAULT_TRANSPARENCY;
    this.data = data;
    this.data.dimensionXCurrent.subscribe((message) => (this.width = message));
    this.data.dimensionYCurrent.subscribe((message) => (this.height = message));

  }

  makeGrid(): string {
    let result = '';
    let x = 0;
    let y = 0;

    while (x < this.width) {
      result += '<line x1=' + x + " y1 ='0' x2 = '" + x + "' y2 = '" +
      this.height + "' style = 'stroke:black; stroke-opacity:" + this.transparency + "' />\n";
      x += this.size;
    }

    while (y < this.height) {
      result += '<line x1=' + 0 + " y1 ='" + y + "' x2 = '" +
      this.width + "' y2 = '" + y + "' style = 'stroke:black; stroke-opacity:" + this.transparency + "' />\n";
      y += this.size;
    }
    return result;
  }

  activateGrid(): void {
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.makeGrid();
    }
  }
  showGrid(): void {
    if (this.isActive) {
      setTimeout(() => {
        ((this.drawing.svg as SVGSVGElement).querySelector('#grid') as HTMLElement).innerHTML = this.makeGrid();
      }, DELAY);
    }
  }

  increaseSize(): void {
    if (this.size < MAX_SIZE) {
    this.size += INCREMENTS;
    this.makeGrid();
    this.showGrid();
  }
}

  decreaseSize(): void {
    if (this.size > MIN_SIZE) {
    this.size -= INCREMENTS;
    this.makeGrid();
    this.showGrid();
    }
  }

}
