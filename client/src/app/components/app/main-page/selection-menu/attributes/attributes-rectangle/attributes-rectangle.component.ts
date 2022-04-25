import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DrawStrategyRectangleService } from 'src/app/services/draw-strategy/draw-strategy-rectangle/draw-strategy-rectangle.service';
import { SHAPE_TYPES } from './../../../../../../enums';

@Component({
  selector: 'app-attributes-rectangle',
  templateUrl: './attributes-rectangle.component.html',
  styleUrls: ['./attributes-rectangle.component.css']
})
export class AttributesRectangleComponent implements OnInit {
  drawRectangleShape: DrawStrategyRectangleService;
  rectangleType: string;
  currentBorderWidth: string;
  activeBorder: boolean;

  @Output() focus: EventEmitter<boolean>;
  @Output() outFocus: EventEmitter<boolean>;

  constructor(drawRectangleShape: DrawStrategyRectangleService) {
    this.drawRectangleShape = drawRectangleShape;
    this.rectangleType = this.drawRectangleShape.attributes[1];
    this.currentBorderWidth = this.drawRectangleShape.attributes[0].toString();
    this.activeBorder = true;
    this.focus = new EventEmitter();
    this.outFocus = new EventEmitter();
   }

  ngOnInit(): void {
    this.rectangleType = this.drawRectangleShape.attributes[1];
    this.changeType();
   }

   changeType(): void {
    this.drawRectangleShape.attributes[1] = this.rectangleType;

    this.activeBorder = !(this.rectangleType === SHAPE_TYPES.FILL);
  }

  onWidthSliderChange(value: number): void {
    if (value !== 0) {
      this.drawRectangleShape.attributes[0] = value;
      this.currentBorderWidth = value.toString();
    }
  }

  onWidthInputChange(value: number): void {
    this.drawRectangleShape.attributes[0] = value;

    this.currentBorderWidth = value.toString();
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

    this.currentBorderWidth = (this.currentBorderWidth === '' ) ? '1' : this.currentBorderWidth;
    this.drawRectangleShape.attributes[0] = parseInt(this.currentBorderWidth, undefined);
    this.outFocus.emit();
  }

}
