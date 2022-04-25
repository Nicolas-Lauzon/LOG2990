import { Injectable } from '@angular/core';
import { DrawBoardStateService } from '../../draw-board-state/draw-board-state.service';
import { DrawStrategySprayService } from '../../draw-strategy/draw-startegy-spray/draw-strategy-spray.service';
import { DrawStrategyService } from '../../draw-strategy/draw-strategy';
import { DrawStrategyBrushService } from '../../draw-strategy/draw-strategy-brush/draw-strategy-brush.service';
import { DrawStrategyBucketService } from '../../draw-strategy/draw-strategy-bucket/draw-strategy-bucket.service';
import { DrawStrategyEllipseService } from '../../draw-strategy/draw-strategy-ellipse/draw-strategy-ellipse.service';
import { DrawStrategyPencilService } from '../../draw-strategy/draw-strategy-pencil/draw-strategy-pencil.service';
import { DrawStrategyPolygonService } from '../../draw-strategy/draw-strategy-polygon/draw-strategy-polygon.service';
import { DrawStrategyRectangleService } from '../../draw-strategy/draw-strategy-rectangle/draw-strategy-rectangle.service';
import { DrawStrategyLineService } from '../../draw-strategy/draw_strategy-line/draw-strategy-line.service';
import { AutomaticSaveService, SAVE_KEY } from '../automatic-save.service';

const SAVE_TOOLS_IDS_KEYS = ['pencil', 'brush', 'spray', 'line', 'rect', 'ellip', 'polygon', 'bucket'];

@Injectable({
  providedIn: 'root'
})
export class LoadService {

  serviceTable: DrawStrategyService[];
  automaticSave: AutomaticSaveService;
  drawBoardState: DrawBoardStateService;

  constructor(drawStrategyBrush: DrawStrategyBrushService,
              drawStrategyEllipse: DrawStrategyEllipseService,
              drawStrategyLine: DrawStrategyLineService,
              drawStrategyPencil: DrawStrategyPencilService,
              drawStrategyPolygon: DrawStrategyPolygonService,
              drawStrategyRectangle: DrawStrategyRectangleService,
              drawStrategySpray: DrawStrategySprayService,
              drawBoardState: DrawBoardStateService,
              bucket: DrawStrategyBucketService,
              automaticSave: AutomaticSaveService) {

    this.serviceTable = [
      drawStrategyPencil,
      drawStrategyBrush,
      drawStrategySpray,
      drawStrategyLine,
      drawStrategyRectangle,
      drawStrategyEllipse,
      drawStrategyPolygon,
      bucket];

    this.drawBoardState = drawBoardState;
    this.automaticSave = automaticSave;
    }

  resetToolsIds(): void {
    const myStorage = window.localStorage;
    for (let i = 0 ; i < this.automaticSave.saveToolsIdsValues.length ; i++) {
      this.serviceTable[i].setCurrentId(0);
      this.automaticSave.saveToolsIdsValues[i] = '0';
      myStorage.setItem(SAVE_TOOLS_IDS_KEYS[i], '0');
    }
  }

  setToolsIds(toolsIds: number[]): void {
    const myStorage = window.localStorage;
    for (let i = 0 ; i < this.automaticSave.saveToolsIdsValues.length ; i++) {
      if (toolsIds[i] !== undefined) {
        this.serviceTable[i].setCurrentId(toolsIds[i]);
        this.automaticSave.saveToolsIdsValues[i] = toolsIds[i].toString();
        myStorage.setItem(SAVE_TOOLS_IDS_KEYS[i], this.automaticSave.saveToolsIdsValues[i]);
      }
    }
  }

  load(): void {
    const myStorage = window.localStorage;
    const tempValueHolder = myStorage.getItem(SAVE_KEY.DRAWING_CONTENT_KEY);
    if (tempValueHolder !== null ) {
      this.automaticSave.data.changeDraw(tempValueHolder);
      this.automaticSave.data.changeDimensionX(parseInt(myStorage.getItem(SAVE_KEY.DRAWING_WIDTH_KEY) as string, undefined));
      this.automaticSave.data.changeDimensionY(parseInt(myStorage.getItem(SAVE_KEY.DRAWING_HEIGHT_KEY) as string, undefined));
    }
    for (let i = 0 ; i < this.serviceTable.length ; i++) {
      this.automaticSave.saveToolsIdsValues[i] = myStorage.getItem(SAVE_TOOLS_IDS_KEYS[i]) as string;
      if (this.automaticSave.saveToolsIdsValues[i] === null) {
        this.automaticSave.saveToolsIdsValues[i] = '0';
      }
      this.serviceTable[i].setCurrentId(parseInt(this.automaticSave.saveToolsIdsValues[i], undefined));
    }
    this.drawBoardState.quickLoad();
  }

}
