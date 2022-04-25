import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DrawStrategyEraserService } from 'src/app/services/draw-strategy/draw-strategy-eraser/draw-strategy-eraser.service';
import { INDEX } from './../../../../../../services/draw-strategy/box';
import { IntervalService } from './../../../../../../services/interval-service/interval.service';

const ERASER_INTERVAL = 2;

@Component({
  selector: 'app-attributes-eraser',
  templateUrl: './attributes-eraser.component.html',
  styleUrls: ['./attributes-eraser.component.scss']
})
export class AttributesEraserComponent implements OnInit {
  eraserTool: DrawStrategyEraserService;
  currentWidth: string;
  interval: IntervalService;

  @Output() focus: EventEmitter<boolean>;
  @Output() outFocus: EventEmitter<boolean>;

  constructor(eraserTool: DrawStrategyEraserService, interval: IntervalService) {
      this.eraserTool = eraserTool;
      this.interval = interval;
      this.interval.setInterval(ERASER_INTERVAL);
      this.focus = new EventEmitter();
      this.outFocus = new EventEmitter();
   }

  ngOnInit(): void {
    this.currentWidth = this.eraserTool.selection.eraserBox.dimensions[INDEX.X].toString();
  }

  onWidthSliderChange(value: number): void {
    if (value !== 0) {
      this.eraserTool.selection.eraserBox.dimensions[INDEX.X] = value;
      this.eraserTool.selection.eraserBox.dimensions[INDEX.Y] = value;
      this.currentWidth = value.toString();
    }
  }

  onWidthInputChange(value: number): void {
    this.eraserTool.selection.eraserBox.dimensions[INDEX.X] = value;
    this.eraserTool.selection.eraserBox.dimensions[INDEX.Y] = value;
    this.currentWidth = value.toString();
  }
  onKeypress(event: KeyboardEvent): boolean {
    const regex = new RegExp('^[0-9]');
    const key = event.key;
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    } else { return true; }
  }

  focusOutValidation(): void {

    this.currentWidth = (this.currentWidth === '' ) ? '3' : this.currentWidth;
    this.eraserTool.selection.eraserBox.dimensions[INDEX.X] = parseInt(this.currentWidth, undefined);
    this.eraserTool.selection.eraserBox.dimensions[INDEX.Y] = parseInt(this.currentWidth, undefined);

    this.outFocus.emit();
  }
}
