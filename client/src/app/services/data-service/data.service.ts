import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DRAWING_MENU_WIDTH } from 'src/app/constants';

@Injectable()
export class DataService {

  private data: {
    fileName: BehaviorSubject<string>;
    tags: BehaviorSubject<string>;
    dimensionX: BehaviorSubject<number>;
    dimensionY: BehaviorSubject<number>;
    color: BehaviorSubject<string>;
    draw: BehaviorSubject<string>;
  };

  fileNameCurrent: Observable<string>;
  tagsCurrent: Observable<string>;
  dimensionXCurrent: Observable<number>;
  dimensionYCurrent: Observable<number>;
  colorCurrent: Observable<string>;
  drawCurrent: Observable<string>;

  constructor() {
    this.data = {
      fileName: new BehaviorSubject(''),
      tags: new BehaviorSubject(''),
      dimensionX: new BehaviorSubject(window.innerWidth - DRAWING_MENU_WIDTH),
      dimensionY: new BehaviorSubject(window.innerHeight),
      color: new BehaviorSubject('#FFFFFF'),
      draw: new BehaviorSubject('')
    };

    this.fileNameCurrent = this.data.fileName.asObservable();
    this.tagsCurrent = this.data.tags.asObservable();
    this.dimensionXCurrent = this.data.dimensionX.asObservable();
    this.dimensionYCurrent = this.data.dimensionY.asObservable();
    this.colorCurrent = this.data.color.asObservable();
    this.drawCurrent = this.data.draw.asObservable();
  }

  changeFileName(message: string): void {
    this.data.fileName.next(message);
  }

  changeTags(message: string): void {
    this.data.tags.next(message);
  }

  changeDimensionX(message: number): void {
    this.data.dimensionX.next(message);
  }

  changeDimensionY(message: number): void {
    this.data.dimensionY.next(message);

  }
  changeColor(message: string): void {
    this.data.color.next(message);
  }

  changeDraw(message: string): void {
    this.data.draw.next(message);
  }

}
