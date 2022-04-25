import { Injectable, Input } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {

@Input() svg: SVGSVGElement | null;
@Input() drawZone: HTMLElement | null;
@Input() selectedZone: HTMLElement | null;
@Input() drawBoard: HTMLElement | null;
@Input() cursorSquare: HTMLElement | null;
constructor() {
  this.drawZone = null;
  this.selectedZone = null;
  this.drawBoard = null;
  this.cursorSquare = null;
}

replaceTag(idTagPair: [string, string]): void {
  if (idTagPair[0] === 'selectedZone' && this.selectedZone) {
    this.selectedZone.innerHTML = idTagPair[1];
    return;
  }

  if (idTagPair[0] && this.drawZone) {
    const destination = this.drawZone.querySelector('#' + idTagPair[0]);
    if (destination) {
      destination.outerHTML = idTagPair[1];
    } else {
      this.drawZone.innerHTML += idTagPair[1];
    }
  }
}

getDrawingElementById(id: string): Element|null {
  if (this.drawZone) {
    return this.drawZone.querySelector('#' + id);
  }
  return null;
}

getElementByIdFromSVG(id: string): Element|null {
  if (this.svg) {
    return this.svg.querySelector('#' + id);
  }
  return null;
}

}
