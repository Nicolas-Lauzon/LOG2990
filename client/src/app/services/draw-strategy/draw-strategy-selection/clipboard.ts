import { DrawStrategySprayService } from '../draw-startegy-spray/draw-strategy-spray.service';
import { DrawStrategyBrushService } from '../draw-strategy-brush/draw-strategy-brush.service';
import { DrawStrategyBucketService } from '../draw-strategy-bucket/draw-strategy-bucket.service';
import { DrawStrategyEllipseService } from '../draw-strategy-ellipse/draw-strategy-ellipse.service';
import { DrawStrategyPolygonService } from '../draw-strategy-polygon/draw-strategy-polygon.service';
import { DrawStrategyRectangleService } from '../draw-strategy-rectangle/draw-strategy-rectangle.service';
import { DrawStrategyLineService } from '../draw_strategy-line/draw-strategy-line.service';
import { DataService } from './../../data-service/data.service';
import { DrawInvokerService } from './../../draw-invoker-service/draw-invoker.service';
import { DrawingService } from './../../drawing-service/drawing.service';
import { DrawStrategyPencilService } from './../draw-strategy-pencil/draw-strategy-pencil.service';
import { Selection } from './selection';
import { Transformation } from './transformation';
const OFFSET = 30;
const D = 3;
const E = 4;
const F = 5;
enum TOOLS {
  PENCIL = 0,
  BRUSH = 1,
  SPRAY = 2,
  LINE = 3,
  RECT = 4,
  ELLIP = 5,
  POLYGON = 6,
  BUCKET = 7
}
enum TARGETS {
  CURRENT = 0,
  INITIAL = 1,
  DUPLICATE = 2,
}
enum INDEX {
  X = 0,
  Y = 1,
  WIDTH = 2,
  HEIGHT = 3
}
enum SERVICE {
  DATA = 0,
  INVOKER = 1,
  DRAWING = 2,
}
export class ClipBoard {
  private copiedTargets: [Map<string, Element>,  Map<string, Node>, Map<string, Node>];
  private selection: Selection;
  private transformation: Transformation;
  private services: [DataService, DrawInvokerService, DrawingService];
  private coords: [number, number, number, number];
  private dimensions: number[];
  tools: [DrawStrategyPencilService, DrawStrategyBrushService, DrawStrategySprayService,
    DrawStrategyLineService, DrawStrategyRectangleService, DrawStrategyEllipseService,
    DrawStrategyPolygonService, DrawStrategyBucketService];

  constructor(drawingService: DrawingService,
              selection: Selection,
              transformation: Transformation,
              drawInvoker: DrawInvokerService,
              tools: [DrawStrategyPencilService,
                      DrawStrategyBrushService,
                      DrawStrategySprayService,
                      DrawStrategyLineService,
                      DrawStrategyRectangleService,
                      DrawStrategyEllipseService,
                      DrawStrategyPolygonService,
                      DrawStrategyBucketService],
              dataService: DataService) {
    this.copiedTargets = [new Map<string, Element>(), new Map<string, Node>(), new Map<string, Node>()];
    this.selection = selection;
    this.tools = tools;
    this.services = [dataService, drawInvoker, drawingService];
    this.transformation = transformation;
    this.dimensions = new Array<number>(2);
    this.coords = [0, 0 , 0 , 0];
  }

  copy(): [string, string] {
    this.copiedTargets[TARGETS.CURRENT] = new Map<string, Element>(this.selection.targets[0]);
    this.copiedTargets[TARGETS.INITIAL] = new Map<string, Node>();
    for (const target of this.selection.targets[0]) {
      this.copiedTargets[TARGETS.INITIAL].set(target[0], target[1].cloneNode(true));
    }
    this.updateCoords();

    return ['', ''];
  }

  paste(): [string, string] {
    this.offset(this.copiedTargets[TARGETS.CURRENT], this.copiedTargets[TARGETS.INITIAL]);
    this.insertElements(this.copiedTargets[TARGETS.CURRENT]);

    this.selection.resetSelection();
    for (const target of this.copiedTargets[TARGETS.CURRENT]) {
      this.selection.addTarget(target[1]);
    }
    this.transformation.memoriseHtmls();
    this.selection.updateSelectedZone();
    this.selection.reinitiate();
    this.updateCoords();
    return ['', ''];
  }
  cut(): [string, string] {
    const doMap = new Map<string, [string, string, string]>();
    this.updateCoords();
    this.copiedTargets[TARGETS.CURRENT] = new Map<string, Element>(this.selection.targets[0]);
    this.copiedTargets[TARGETS.INITIAL] = new Map<string, Node>();
    for (const target of this.selection.targets[0]) {
      this.copiedTargets[TARGETS.INITIAL].set(target[0], target[1].cloneNode(true));
    }
    this.selection.targets[0].forEach((target) => {
      doMap.set(target.id, [target.id, '', target.outerHTML]);
    });
    this.services[SERVICE.INVOKER].do(Array.from(doMap.values()));
    this.selection.resetSelection();
    this.transformation.lastCommand.clear();
    return ['', ''];
  }

  delete(): [string, string] {
    const doMap = new Map<string, [string, string, string]>();
    this.selection.targets[0].forEach((target) => {
      doMap.set(target.id, [target.id, '', target.outerHTML]);
    });
    this.services[SERVICE.INVOKER].do(Array.from(doMap.values()));
    this.selection.resetSelection();
    this.updateCoords();
    this.transformation.lastCommand.clear();
    return ['', ''];
  }

  duplicate(): [string, string] {
    const targets: Map<string, Element> = new Map<string, Element>(this.selection.targets[0]);
    this.copiedTargets[TARGETS.DUPLICATE].clear();
    this.selection.targets[0].forEach((target) => this.copiedTargets[TARGETS.DUPLICATE].set(target.id, target.cloneNode(true)));
    this.copiedTargets[TARGETS.DUPLICATE].forEach((target) => targets.set((target as Element).id, target as Element ));
    this.offset(targets, this.copiedTargets[TARGETS.DUPLICATE]);
    this.insertElements(targets);

    this.selection.resetSelection();
    for (const target of targets) {
      this.selection.addTarget(target[1]);
    }
    this.transformation.memoriseHtmls();
    this.selection.updateSelectedZone();
    this.selection.reinitiate();
    this.updateCoords();
    return ['', ''];
  }

  isClipboardEmpty(): boolean {
    return this.copiedTargets[TARGETS.CURRENT].size === 0;
  }

  private offset(current: Map<string, Element>, initial: Map<string, Node>): void {
    this.services[SERVICE.DATA].dimensionXCurrent.subscribe((message) => (this.dimensions[0] = message));
    this.services[SERVICE.DATA].dimensionYCurrent.subscribe((message) => (this.dimensions[1] = message));
    for (const target of current.entries()) {

      let trans = '';
      let offsetX = OFFSET;
      let offsetY = OFFSET;
      this.changeId(target, initial);

      if ( this.coords[INDEX.X] + this.coords[INDEX.WIDTH] + offsetX  > this.dimensions[0] ||
           this.coords[INDEX.Y] + this.coords[INDEX.HEIGHT] + offsetY  > this.dimensions[1] ) {
        const initElement = initial.get(target[0]) as SVGGraphicsElement;
        const initTransform = initElement.getAttribute('transform');
        trans = initTransform ? initTransform : '';
      } else {
        const transform = target[1].getAttribute('transform');
        trans = 'matrix(1 0 0 1 ' + offsetX + ' ' + offsetY + ')';
        if (transform) {
          let matrixValues = transform.split('matrix')[1];
          matrixValues = matrixValues.split('(')[1];
          matrixValues = matrixValues.split(')')[0];
          const valuesTab = matrixValues.split(' ');
          offsetX = Number(valuesTab[E]) + OFFSET;
          offsetY = Number(valuesTab[F]) + OFFSET;
          trans = 'matrix(' + valuesTab[0] + ' ' + valuesTab[1] + ' ' + valuesTab[2] +
          ' ' + valuesTab[D] + ' ' + offsetX + ' ' + offsetY + ')';
       }
      }
      target[1].setAttribute('transform', trans);
    }
  }
  private changeId(element: [string, Element], initial: Map<string, Node>): void {
    const initialElement = initial.get(element[0]);
    if (element[0].includes('rect')) {
      const elementId = this.tools[TOOLS.RECT].getCurrentId();
      this.tools[TOOLS.RECT].setCurrentId(elementId + 1);
      element[0] = 'rect' + elementId.toString();
      element[1].id = 'rect' + elementId.toString();
    }
    if (element[0].includes('polygon')) {
      const elementId = this.tools[TOOLS.POLYGON].getCurrentId();
      this.tools[TOOLS.POLYGON].setCurrentId(elementId + 1);
      element[0] = 'polygon' + elementId.toString();
      element[1].id = 'polygon' + elementId.toString();
    }
    if (element[0].includes('pencil')) {
      const elementId = this.tools[TOOLS.PENCIL].getCurrentId();
      this.tools[TOOLS.PENCIL].setCurrentId(elementId + 1);
      element[0] = 'pencil' + elementId.toString();
      element[1].id = 'pencil' + elementId.toString();
    }
    if (element[0].includes('ellip')) {
      const elementId = this.tools[TOOLS.ELLIP].getCurrentId();
      this.tools[TOOLS.ELLIP].setCurrentId(elementId + 1);
      element[0] = 'ellip' + elementId.toString();
      element[1].id = 'ellip' + elementId.toString();
    }
    if (element[0].includes('brush')) {
      const elementId = this.tools[TOOLS.BRUSH].getCurrentId();
      this.tools[TOOLS.BRUSH].setCurrentId(elementId + 1);
      element[0] = 'brush' + elementId.toString();
      element[1].id = 'brush' + elementId.toString();
    }
    if (element[0].includes('spray')) {
      const elementId = this.tools[TOOLS.SPRAY].getCurrentId();
      this.tools[TOOLS.SPRAY].setCurrentId(elementId + 1);
      element[0] = 'spray' + elementId.toString();
      element[1].id = 'spray' + elementId.toString();
    }
    if (element[0].includes('line')) {
      const elementId = this.tools[TOOLS.LINE].getCurrentId();
      this.tools[TOOLS.LINE].setCurrentId(elementId + 1);
      element[0] = 'line' + elementId.toString();
      element[1].id = 'line' + elementId.toString();
    }
    if (element[0].includes('bucket')) {
      const elementId = this.tools[TOOLS.BUCKET].getCurrentId();
      this.tools[TOOLS.BUCKET].setCurrentId(elementId + 1);
      element[0] = 'bucket' + elementId.toString();
      element[1].id = 'bucket' + elementId.toString();
    }
    initial.set(element[0], initialElement as Node );
    return;
  }

  private updateCoords(): void {
    this.coords[INDEX.X] = this.selection.selectedBox.topLeft[0];
    this.coords[INDEX.Y] = this.selection.selectedBox.topLeft[1];
    this.coords[INDEX.WIDTH] = this.selection.selectedBox.dimensions[0];
    this.coords[INDEX.HEIGHT] = this.selection.selectedBox.dimensions[1];
  }

  private insertElements(targets: Map<string, Element>): void {
    if (this.services[SERVICE.DRAWING].drawZone) {
      const doMap = new Map<string, [string, string, string]>();
      for (const target of targets) {
        doMap.set(target[1].id, [target[1].id, target[1].outerHTML, '']);
      }
      this.services[SERVICE.INVOKER].do(Array.from(doMap.values()));
    }
  }
}
