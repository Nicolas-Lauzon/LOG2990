import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DrawStrategyEllipseService } from '../../../../../../services/draw-strategy/draw-strategy-ellipse/draw-strategy-ellipse.service';
import { SHAPE_TYPES } from './../../../../../../enums';

@Component({
  selector: 'app-attributes-ellipse',
  templateUrl: './attributes-ellipse.component.html',
  styleUrls: ['./attributes-ellipse.component.css']
})
export class AttributesEllipseComponent implements OnInit {
  drawEllipseShape: DrawStrategyEllipseService;
  rectangleType: string;
  currentBorderWidth: string;
  activeBorder: boolean;

  @Output() focus: EventEmitter<boolean>;
  @Output() outFocus: EventEmitter<boolean>;

  constructor( drawEllipseShape: DrawStrategyEllipseService) {
    this.drawEllipseShape = drawEllipseShape;
    this.rectangleType = this.drawEllipseShape.attributes[1];
    this.currentBorderWidth = this.drawEllipseShape.attributes[0].toString();
    this.activeBorder = true;
    this.focus = new EventEmitter();
    this.outFocus = new EventEmitter();
   }

  ngOnInit(): void {
    this.currentBorderWidth = this.drawEllipseShape.attributes[0].toString();
    this.changeType();
   }

   changeType(): void {
    this.drawEllipseShape.attributes[1] = this.rectangleType;
    this.activeBorder = !(this.rectangleType === SHAPE_TYPES.FILL);
  }

  onWidthSliderChange(value: number): void {
    if (value !== 0) {
      this.drawEllipseShape.attributes[0] = value;
      this.currentBorderWidth = value.toString();

    }
  }
  onKeypress(event: KeyboardEvent): boolean {
    const regex = new RegExp('^[0-9]');
    const key = event.key;
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    } else { return true; }
  }

  onWidthInputChange(value: number): void {
    this.drawEllipseShape.attributes[0] = value;
    this.currentBorderWidth = value.toString();
  }

  focusOutValidation(): void {
    this.currentBorderWidth = (this.currentBorderWidth === '') ? '1' : this.currentBorderWidth;
    this.drawEllipseShape.attributes[0] = parseInt(this.currentBorderWidth, undefined);

    this.outFocus.emit();
  }

}
