import { DrawingService } from '../../drawing-service/drawing.service';

const BASE_WIDTH_CHANGE = 5;
const WIDTH_CHANGE_FACTOR = 1.1;

export class EraserStyler {
  topMostElement: Element | null;
  ancientStyle: string[];
  drawingService: DrawingService;

  constructor(drawingService: DrawingService) {
    this.drawingService = drawingService;
    this.topMostElement = null;
    this.ancientStyle = [''];
  }

  memoriseStyle(): void {
    if (!this.topMostElement) {
      this.ancientStyle = [];
      return;
    }
    let i = 0;
    this.ancientStyle = [];
    while (i < this.topMostElement.children.length) {
      const style: string | null = (this.topMostElement.children[i] as HTMLElement).getAttribute('style');
      if (style) {
        this.ancientStyle.push(style);
      }
      i++;
    }
  }

  private changeFillsAndStrokes(list: HTMLCollection): void {

    Array.from(list).forEach((element) => {
      this.changeStroke(element);

      if (element.classList.contains('fill')) {
        (element as HTMLElement).style.fill = '#ff0000';
      }
    });
  }

  private changeStrokes(list: HTMLCollection): void {
    Array.from(list).forEach((element) => {
      if (element.classList.contains('contour')) {
        this.changeStroke(element);
      }
    });
  }

  private changeStroke(element: Element): void {
    const strokeWidth = element.getAttribute('stroke-width');
    let width = 0;
    if (strokeWidth === null) {
      width =  BASE_WIDTH_CHANGE;
    } else {
      width =  parseInt(strokeWidth, 10) * WIDTH_CHANGE_FACTOR + BASE_WIDTH_CHANGE;
    }
    (element as HTMLElement).style.strokeWidth = width.toString();
    (element as HTMLElement).style.stroke = '#ff0000';
  }

  private addContour(list: HTMLCollection): void {
    Array.from(list).forEach((element) => {
      (element as HTMLElement).style.strokeWidth = '5';
      (element as HTMLElement).style.stroke = '#ff0000';
    });
  }

  changeStyle(): void {
    if (!this.topMostElement) {
      return;
    }

    const childs = this.topMostElement.children;

    if (this.topMostElement.classList.contains('other')) {
      this.changeFillsAndStrokes(childs);
    } else if (this.topMostElement.classList.contains('contour')) {
      this.changeStrokes(childs);
    } else if (this.topMostElement.id.includes('bucket')) {
      if (this.topMostElement.childElementCount < 2) {
      const redRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      redRect.setAttribute('width',
       (Number(this.topMostElement.getBoundingClientRect().right - this.topMostElement.getBoundingClientRect().left).toString()));
      redRect.setAttribute('height',
       (Number(this.topMostElement.getBoundingClientRect().bottom - this.topMostElement.getBoundingClientRect().top).toString()));
      redRect.setAttribute('stroke-width', '5px');
      redRect.setAttribute('x', (this.topMostElement.children[0].getAttribute('x') as string));
      redRect.setAttribute('y', (this.topMostElement.children[0].getAttribute('y') as string));
      redRect.setAttribute('stroke', '#ff0000');
      redRect.setAttribute('fill', 'none');
      this.topMostElement.appendChild(redRect);
      }
    } else {
      this.addContour(childs);

    }
  }

  restoreStyle(): void {
    if (!this.topMostElement) {
      return;
    }
    if (this.topMostElement.id.includes('bucket')) {
      if (this.topMostElement.children[1]) {
        this.topMostElement.removeChild(this.topMostElement.children[1]);
      } else {
        this.topMostElement = null;
      }
      return;
    }
    let i = 0;
    while (i < this.topMostElement.children.length) {
      (this.topMostElement.children[i] as HTMLElement).setAttribute('style', this.ancientStyle[i] as string);
      i++;
    }
    this.drawingService.replaceTag([this.topMostElement.id, this.topMostElement.outerHTML]);
  }

}
