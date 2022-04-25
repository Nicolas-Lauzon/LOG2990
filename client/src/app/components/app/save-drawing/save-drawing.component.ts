import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DrawStrategySprayService } from 'src/app/services/draw-strategy/draw-startegy-spray/draw-strategy-spray.service';
import { DrawStrategyService } from 'src/app/services/draw-strategy/draw-strategy';
import { DrawStrategyBrushService } from 'src/app/services/draw-strategy/draw-strategy-brush/draw-strategy-brush.service';
import { DrawStrategyBucketService } from 'src/app/services/draw-strategy/draw-strategy-bucket/draw-strategy-bucket.service';
import { DrawStrategyEllipseService } from 'src/app/services/draw-strategy/draw-strategy-ellipse/draw-strategy-ellipse.service';
import { DrawStrategyPencilService } from 'src/app/services/draw-strategy/draw-strategy-pencil/draw-strategy-pencil.service';
import { DrawStrategyPolygonService } from 'src/app/services/draw-strategy/draw-strategy-polygon/draw-strategy-polygon.service';
import { DrawStrategyRectangleService } from 'src/app/services/draw-strategy/draw-strategy-rectangle/draw-strategy-rectangle.service';
import { DrawStrategyLineService } from 'src/app/services/draw-strategy/draw_strategy-line/draw-strategy-line.service';
import { WebClientService } from 'src/app/services/web-client/web-client.service';
import { DrawBoardStateService } from './../../../services/draw-board-state/draw-board-state.service';

const TAGS_MAX_LENGTH = 10;
enum DRAWING_ELEMENT {
  DRAW = 0,
  NAME = 1,
  CURRENT_TAG = 2,
  TAGS_TAB = 3
}
export enum SERVICE {
  DRAWBOARD = 0,
  TOOLS = 1,
  CURRENT_ID = 2,
  FORMBUILDER_INDEX = 3,
  WEBCLIENTSERVICE_INDEX = 4
}
@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent implements OnInit {
    myForm: FormGroup;
    showComponent: boolean;
    drawingElement: [string, string, string, string[]];
    serviceTable: [DrawBoardStateService, DrawStrategyService[], number[] , FormBuilder, WebClientService];
    elementRef: ElementRef;
    @Input() position: [number, number];
    @Output() closeButton: EventEmitter<boolean>;

    constructor(elref: ElementRef,
                fb: FormBuilder,
                webClient: WebClientService,
                drawStrategyBrush: DrawStrategyBrushService,
                drawStrategyEllipse: DrawStrategyEllipseService,
                drawStrategyLine: DrawStrategyLineService,
                drawStrategyPencil: DrawStrategyPencilService,
                drawStrategyPolygon: DrawStrategyPolygonService,
                drawStrategyRectangle: DrawStrategyRectangleService,
                drawStrategySpray: DrawStrategySprayService,
                bucket: DrawStrategyBucketService,
                drawBoard: DrawBoardStateService) {
      this.serviceTable = [drawBoard, [
        drawStrategyPencil,
        drawStrategyBrush,
        drawStrategySpray,
        drawStrategyLine,
        drawStrategyRectangle,
        drawStrategyEllipse,
        drawStrategyPolygon,
        bucket
    ], [], fb, webClient];
      this.closeButton = new EventEmitter();
      this.myForm = this.serviceTable[SERVICE.FORMBUILDER_INDEX].group({
          fileName: ['', [Validators.required, Validators.min(1), Validators.pattern('^[a-zA-Z0-9]*$')]],
          tags: ['', [Validators.minLength(0), Validators.maxLength(TAGS_MAX_LENGTH), Validators.pattern('^[a-zA-Z0-9]*$')]],
      });
      this.drawingElement = ['', '', '', []];

      this.position = [0, 0];
      this.elementRef = elref;
    }

    ngOnInit(): void {
        this.drawingElement[DRAWING_ELEMENT.CURRENT_TAG] = '';
        this.showComponent = true;
        this.serviceTable[SERVICE.CURRENT_ID] = [];

        const appElement = this.elementRef.nativeElement.querySelector('#content');
        const topDistance: string = 'top: ' + -this.position[0].toString() + 'px; ';
        const leftDistance: string = 'left: ' + -this.position[1].toString() + 'px;';
        const comp = topDistance + leftDistance;
        appElement.setAttribute('style', comp);
    }

    getToolsId(): void {
        for (const tool of this.serviceTable[SERVICE.TOOLS]) {
            this.serviceTable[SERVICE.CURRENT_ID].push(tool.getCurrentId());
        }
    }

    saveData(): void {
        this.showComponent = false;
        const html: string = (this.serviceTable[SERVICE.DRAWBOARD].drawboard as HTMLElement).innerHTML;
        this.getToolsId();
        if (!(this.myForm.value.fileName === '')) {
            this.serviceTable[SERVICE.WEBCLIENTSERVICE_INDEX].addDrawing(this.myForm.value.fileName,
            this.drawingElement[DRAWING_ELEMENT.TAGS_TAB], html, this.serviceTable[SERVICE.CURRENT_ID]);
            this.showComponent = true;
        }
        if (this.showComponent) {
            this.closeButton.emit();
        }
    }

    get fileName(): AbstractControl | null {
        return this.myForm.get('fileName');
    }

    get tags(): AbstractControl | null {
        return this.myForm.get('tags');
    }

    onKeypress(event: KeyboardEvent): boolean {
      const regex = new RegExp('^[a-zA-Z0-9]*$');
      const key = event.key;
      if (!regex.test(key)) {
        event.preventDefault();
        return false;
      } else { return true; }
    }

    removeTag(tag: string): void {
        const index = this.drawingElement[DRAWING_ELEMENT.TAGS_TAB].indexOf(tag, 0);
        this.drawingElement[DRAWING_ELEMENT.TAGS_TAB].splice(index, 1);
    }

    addTag(): void {
      if (this.getError() !== 'none') {
        return;
      }
      if (this.drawingElement[DRAWING_ELEMENT.CURRENT_TAG] === '' ) {
        return;
      }
      if (!this.drawingElement[DRAWING_ELEMENT.TAGS_TAB].includes(this.drawingElement[DRAWING_ELEMENT.CURRENT_TAG])) {
        this.drawingElement[DRAWING_ELEMENT.TAGS_TAB].push(this.drawingElement[DRAWING_ELEMENT.CURRENT_TAG]);
      }
      this.drawingElement[DRAWING_ELEMENT.CURRENT_TAG] = '';
    }

    getError(): string {
      const tagError = this.tags as AbstractControl;
      if (tagError.hasError('maxlength')) {
          return 'Le nom du tag est trop long.';
        }
      if (tagError.hasError('pattern')) {
          return 'Veuillez entrez que des lettres ou des chiffres sans espace.';
        }
      return 'none';
    }
}
