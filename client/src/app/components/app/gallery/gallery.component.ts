import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Drawing } from 'src/app/drawing';
import { LoadService } from 'src/app/services/automatic-save-service/load-service/load.service';
import { DrawBoardStateService } from 'src/app/services/draw-board-state/draw-board-state.service';
import { DrawInvokerService } from 'src/app/services/draw-invoker-service/draw-invoker.service';
import { DrawStrategySprayService } from 'src/app/services/draw-strategy/draw-startegy-spray/draw-strategy-spray.service';
import { DrawStrategyService } from 'src/app/services/draw-strategy/draw-strategy';
import { DrawStrategyBrushService } from 'src/app/services/draw-strategy/draw-strategy-brush/draw-strategy-brush.service';
import { DrawStrategyBucketService } from 'src/app/services/draw-strategy/draw-strategy-bucket/draw-strategy-bucket.service';
import { DrawStrategyEllipseService } from 'src/app/services/draw-strategy/draw-strategy-ellipse/draw-strategy-ellipse.service';
import { DrawStrategyPencilService } from 'src/app/services/draw-strategy/draw-strategy-pencil/draw-strategy-pencil.service';
import { DrawStrategyPolygonService } from 'src/app/services/draw-strategy/draw-strategy-polygon/draw-strategy-polygon.service';
import { DrawStrategyRectangleService } from 'src/app/services/draw-strategy/draw-strategy-rectangle/draw-strategy-rectangle.service';
import { DrawStrategyLineService } from 'src/app/services/draw-strategy/draw_strategy-line/draw-strategy-line.service';
import { DataService } from './../../../services/data-service/data.service';
import { WebClientService } from './../../../services/web-client/web-client.service';
const GREATER_THAN = 1;
const LOWER_THAN = -1;
const TOOLSID_ARRAY_MAX_INDEX = 6;
const TOP_MARGIN = 20;

enum INTERRUPT {
  LOAD = 'isLoading',
  RESULTS = 'noResults',
  ALERT = 'showAlert'
}
enum INDEX {
  DRAWINGS = 0,
  FILTERED = 1,
  GALLERY_DRAWING = 2
}
enum TAG_HANDLER {
  CURRENT_TAG = 0,
  TAGS = 1,
}

enum SERVICE {
  WEB_C = 0,
  DATA = 1,
  ElementRef = 2,
  DRAWNOARD = 3,
  ROUTER = 4,
  INVOKER = 5,
  LOAD = 6
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  private drawings: [ Drawing[], Drawing[], string];
  private tagHandler: [string, string[]];
  private interruptors: Map<string, boolean>;
  tools: [number[], DrawStrategyService[]];
  services: [WebClientService, DataService, ElementRef, DrawBoardStateService, Router, DrawInvokerService, LoadService];
  @Output() exitGallery: EventEmitter<boolean>;
  @Input() position: [number, number];

  setToolsCurrentId(toolsId: number[]): void {
    for (let i = 0 ; i <= TOOLSID_ARRAY_MAX_INDEX ; i++) {
      this.tools[1][i].setCurrentId(toolsId[i]);
    }
    this.services[SERVICE.LOAD].setToolsIds(toolsId);
  }

  constructor(elementRef: ElementRef,
              w: WebClientService,  d: DataService,
              router: Router,
              drawBoardState: DrawBoardStateService,
              drawStrategyBrush: DrawStrategyBrushService,
              drawStrategyEllipse: DrawStrategyEllipseService,
              drawStrategyLine: DrawStrategyLineService,
              drawStrategyPencil: DrawStrategyPencilService,
              drawStrategyPolygon: DrawStrategyPolygonService,
              drawStrategyRectangle: DrawStrategyRectangleService,
              drawStrategySpray: DrawStrategySprayService,
              bucket: DrawStrategyBucketService,
              drawInvoker: DrawInvokerService,
              load: LoadService
    ) {
    this.tools = [[] , []];
    this.services = [w, d, elementRef, drawBoardState, router, drawInvoker, load ];
    this.tagHandler = ['', []];
    this.tools = [[], [drawStrategyPencil,
                      drawStrategyBrush,
                      drawStrategySpray,
                      drawStrategyLine,
                      drawStrategyRectangle,
                      drawStrategyEllipse,
                      drawStrategyPolygon,
                      bucket]];
    this.interruptors = new Map([[INTERRUPT.RESULTS, false],
                               [INTERRUPT.LOAD, true],
                               [INTERRUPT.ALERT, false]]);
    this.drawings = [[], [], ''];
    this.exitGallery = new EventEmitter();
    this.position = [0, 0];
  }

  ngOnInit(): void {
    this.interruptors.set(INTERRUPT.LOAD, true);
    this.getDrawings();
    const appElement = this.services[SERVICE.ElementRef].nativeElement.querySelector('#content');
    const topDistance: string = 'top: ' + (-this.position[0] + TOP_MARGIN).toString() + 'px; ';
    const leftDistance: string = 'left: ' + -this.position[1].toString() + 'px;';
    const comp = topDistance + leftDistance;
    appElement.setAttribute('style', comp);
  }

  private getDrawings(): void {
    this.services[SERVICE.WEB_C].getAllDrawings().subscribe((array: Drawing[]) => {
      this.drawings[INDEX.DRAWINGS] =  array;
      this.interruptors.set(INTERRUPT.LOAD, false);
      this.sortDrawings(this.drawings[INDEX.DRAWINGS]);
    });
  }

  private sortDrawings(drawings: Drawing[]): void  {
    drawings.sort((a: Drawing, b: Drawing) => {
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return GREATER_THAN;
      } else {
        return LOWER_THAN;
      }
    });
    this.drawings[INDEX.FILTERED] = drawings;
    this.drawings[INDEX.FILTERED] = this.drawings[INDEX.FILTERED].filter((a: Drawing) => {
      return a.drawingHtml !== '';
    });
    const bool = this.drawings[INDEX.FILTERED].length === 0 ;
    this.interruptors.set(INTERRUPT.RESULTS, bool);
  }

  private search(): void  {
    const searchResult: Drawing[] = [];
    for (const filterTags of this.tagHandler[TAG_HANDLER.TAGS]) {
      for (const drawing of this.drawings[INDEX.DRAWINGS] ) {
        drawing.tags = drawing.tags.map((a: string) => {
          return a.toLowerCase() ;
        });
        if (drawing.tags.includes(filterTags) && !searchResult.includes(drawing)) {
          searchResult.push(drawing);
        }
      }
    }
    this.sortDrawings(searchResult);
  }

  delete(drawing: Drawing): void  {
    this.drawings[INDEX.FILTERED] = this.drawings[INDEX.FILTERED].filter((a: Drawing) => {
      return drawing !== a;
    });
    this.services[SERVICE.WEB_C].deleteDrawing(drawing._id).subscribe();
  }

  load(drawing: Drawing): void  {
    this.tools[0] = drawing.toolIDs;
    this.drawings[INDEX.GALLERY_DRAWING] = drawing.drawingHtml;
    this.services[SERVICE.DATA].drawCurrent.subscribe((message) => {
      if (message === '') {
        this.replace();
      } else {
        this.interruptors.set(INTERRUPT.ALERT, true);
      }
    });

  }

  replace(): void  {
    const html = document.createElement('g') ;
    html.innerHTML = this.drawings[INDEX.GALLERY_DRAWING];
    const width: number = parseInt(((html.firstElementChild as SVGAElement).getAttribute('width') as string ), 10);
    const height: number = parseInt(((html.firstElementChild as SVGAElement).getAttribute('height') as string ), 10);
    this.services[SERVICE.DATA].changeDimensionX(width);
    this.services[SERVICE.DATA].changeDimensionY(height);
    this.setToolsCurrentId(this.tools[0]);
    this.services[SERVICE.DATA].changeDraw(this.drawings[INDEX.GALLERY_DRAWING]);
    this.services[SERVICE.DRAWNOARD].quickLoad();
    this.services[SERVICE.ROUTER].navigate(['/ZoneDessin']);
    this.services[SERVICE.INVOKER].reset();
    this.services[SERVICE.LOAD].automaticSave.firstSave();
    this.exitGallery.emit();
  }

  addTag(): void {
    if (this.tagHandler[TAG_HANDLER.CURRENT_TAG] === '' || this.tagHandler[TAG_HANDLER.TAGS]
    .includes(this.tagHandler[TAG_HANDLER.CURRENT_TAG])) {
      this.tagHandler[TAG_HANDLER.CURRENT_TAG] = '';
      return ;
    }
    this.tagHandler[TAG_HANDLER.TAGS].push(this.tagHandler[TAG_HANDLER.CURRENT_TAG]);
    this.tagHandler[TAG_HANDLER.CURRENT_TAG] = '';
    this.search();
  }

  removeTag(tag: string): void {
    this.tagHandler[TAG_HANDLER.TAGS] = this.tagHandler[TAG_HANDLER.TAGS].filter((a: string) => {
      return tag !== a;
    });
    if (this.tagHandler[TAG_HANDLER.TAGS].length === 0) {
      this.interruptors.set(INTERRUPT.RESULTS, false);
      this.ngOnInit();
    } else {
      this.search();
    }
  }
}
