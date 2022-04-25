import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DrawStrategyBrushService, USER_OPTION } from 'src/app/services/draw-strategy/draw-strategy-brush/draw-strategy-brush.service';

@Component({
  selector: 'app-attributes-brush',
  templateUrl: './attributes-brush.component.html',
  styleUrls: ['./attributes-brush.component.css']
})
export class AttributesBrushComponent implements OnInit {
  drawBrushTool: DrawStrategyBrushService;
  currentWidth: string;
  brushFilterIndex: number;
  brushStatus: string[];

  @Output() focus: EventEmitter<boolean>;
  @Output() outFocus: EventEmitter<boolean>;

  constructor(drawBrushTool: DrawStrategyBrushService) {
    this.drawBrushTool = drawBrushTool;
    this.brushFilterIndex = 0;
    this.brushStatus = ['active', '', '', '', '', ''];
    this.focus = new EventEmitter();
    this.outFocus = new EventEmitter();
  }

  ngOnInit(): void {

    this.currentWidth = this.drawBrushTool.userOptions[USER_OPTION.WIDTH].toString();

  }

  onSliderChange(value: number): void {
    if (value !== 0) {
      this.drawBrushTool.userOptions[USER_OPTION.WIDTH] = value;
      this.currentWidth = value.toString();
    }
  }

  onTextChange(value: number): void {
    this.drawBrushTool.userOptions[USER_OPTION.WIDTH] = value;
    this.currentWidth = value.toString();
  }

  brushFilterShadeChanger(index: number): void {
    if (index !== this.brushFilterIndex) {
      this.brushStatus[this.brushFilterIndex] = '';
      this.brushStatus[index] = 'active';
      this.brushFilterIndex = index;
    }
  }

  onClickFilter(index: number): void {
    this.drawBrushTool.userOptions[USER_OPTION.FILTER] = 'filter' + index.toString();
    this.brushFilterShadeChanger(index);
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

    this.currentWidth = (this.currentWidth === '' ) ? '1' : this.currentWidth;
    this.drawBrushTool.userOptions[USER_OPTION.WIDTH] = parseInt(this.currentWidth, undefined);

    this.outFocus.emit();
  }

}
