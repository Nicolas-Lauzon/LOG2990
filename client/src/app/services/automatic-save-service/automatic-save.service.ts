import {  Injectable, Input } from '@angular/core';
import { DataService } from '../data-service/data.service';

export enum SAVE_KEY {
  DRAWING_WIDTH_KEY = 'width',
  DRAWING_HEIGHT_KEY = 'height',
  DRAWING_CONTENT_KEY = 'drawing'
}

@Injectable({
  providedIn: 'root'
})
export class AutomaticSaveService {

savedDrawing: string;
saveToolsIdsValues: string[];
data: DataService;
drawingWidth: string;
drawingHeight: string;

@Input() elRef: HTMLElement | null;

currentToolsIds: number[];

  constructor(d: DataService ) {
    const myStorage = window.localStorage;
    this.savedDrawing = myStorage.getItem(SAVE_KEY.DRAWING_CONTENT_KEY) as string;
    this.drawingHeight = myStorage.getItem(SAVE_KEY.DRAWING_HEIGHT_KEY) as string;
    this.drawingWidth = myStorage.getItem(SAVE_KEY.DRAWING_WIDTH_KEY) as string;

    this.currentToolsIds = [0, 0, 0, 0, 0, 0, 0];
    this.saveToolsIdsValues = ['', '', '', '', '', '', '', ''];
    this.data = d;
    this.elRef = null;

    if (this.savedDrawing !== null) {
      this.data.changeDraw(this.savedDrawing);
      this.data.changeDimensionX(parseInt(this.drawingWidth, undefined));
      this.data.changeDimensionY(parseInt(this.drawingHeight, undefined));
    } else {
      this.data.changeDraw('');
      this.data.changeDimensionX(0);
      this.data.changeDimensionY(0);
    }
  }

  firstSave(): void {
    const myStorage = window.localStorage;

    let tempValueHolder = '';
    this.data.drawCurrent.subscribe((message) => (tempValueHolder = message));
    myStorage.setItem(SAVE_KEY.DRAWING_CONTENT_KEY, tempValueHolder);

    this.data.dimensionXCurrent.subscribe((message) => (tempValueHolder = message.toString()));
    myStorage.setItem(SAVE_KEY.DRAWING_WIDTH_KEY, tempValueHolder);

    this.data.dimensionYCurrent.subscribe((message) => (tempValueHolder = message.toString()));
    myStorage.setItem(SAVE_KEY.DRAWING_HEIGHT_KEY, tempValueHolder);

  }

  toolModificationSave(args: [string, string][]): void {
    const myStorage = window.localStorage;
    if (this.elRef !== null) {
      myStorage.setItem(SAVE_KEY.DRAWING_CONTENT_KEY, this.elRef.innerHTML);
    }
    for (const value of args) {
      myStorage.setItem(value[0], value[1]);
    }

  }

  undoRedoSave(): void {
    const myStorage = window.localStorage;
    if (this.elRef !== null) {
      myStorage.setItem(SAVE_KEY.DRAWING_CONTENT_KEY, this.elRef.innerHTML);
    }
  }

}
