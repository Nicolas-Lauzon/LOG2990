import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DrawStrategyPolygonService } from 'src/app/services/draw-strategy/draw-strategy-polygon/draw-strategy-polygon.service';
import { SHAPE_TYPES } from './../../../../../../enums';

@Component({
  selector: 'app-attributes-polygon',
  templateUrl: './attributes-polygon.component.html',
  styleUrls: ['./attributes-polygon.component.css']
})
export class AttributesPolygonComponent implements OnInit {
  drawPolygonShape: DrawStrategyPolygonService;
  polygonType: string;
  currentBorderWidth: string;
  activeBorder: boolean;
  sideNumber: number;

  @Output() focus: EventEmitter<boolean>;
  @Output() outFocus: EventEmitter<boolean>;

  constructor(drawPolygonShape: DrawStrategyPolygonService) {
    this.drawPolygonShape = drawPolygonShape;
    this.focus = new EventEmitter();
    this.outFocus = new EventEmitter();
   }

  ngOnInit(): void {
    this.polygonType = this.drawPolygonShape.type;
    this.currentBorderWidth = this.drawPolygonShape.polygonParams.attributes[1].toString();
    this.sideNumber = this.drawPolygonShape.polygonParams.attributes[0];
    this.changeType();
   }

   changeType(): void {
    this.drawPolygonShape.type = this.polygonType;
    this.activeBorder = !(this.polygonType === SHAPE_TYPES.FILL);
  }

  onWidthSliderChange(value: number): void {
    if (value !== 0) {
      this.drawPolygonShape.polygonParams.attributes[1] = value;
      this.currentBorderWidth = value.toString();

    }
  }

  onWidthInputChange(value: number): void {
    this.drawPolygonShape.polygonParams.attributes[1] = value;
    this.currentBorderWidth = value.toString();
  }

  onSideInputChange(value: number): void {
    this.drawPolygonShape.polygonParams.attributes[0] = value;
    this.sideNumber = value;
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
    const numero = 3;
    this.sideNumber = (this.sideNumber < numero) ? numero : this.sideNumber;
    this.drawPolygonShape.polygonParams.attributes[0] = this.sideNumber;

    this.currentBorderWidth = (this.currentBorderWidth === '' ) ? '1' : this.currentBorderWidth;
    this.drawPolygonShape.polygonParams.attributes[1] = parseInt(this.currentBorderWidth, undefined);

    this.outFocus.emit();
  }

}
