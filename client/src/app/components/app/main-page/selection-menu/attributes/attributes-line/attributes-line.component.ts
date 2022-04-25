import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DIMENSIONS, DrawStrategyLineService, IS_USED } from 'src/app/services/draw-strategy/draw_strategy-line/draw-strategy-line.service';

@Component({
  selector: 'app-attributes-line',
  templateUrl: './attributes-line.component.html',
  styleUrls: ['./attributes-line.component.css']
})
export class AttributesLineComponent implements OnInit {
  lineDrawTool: DrawStrategyLineService;
  currentLineWidth: string;
  currentJointWidth: string;

  @Output() focus: EventEmitter<boolean>;
  @Output() outFocus: EventEmitter<boolean>;

  constructor(lineDrawTool: DrawStrategyLineService) {
    this.lineDrawTool = lineDrawTool;
    this.focus = new EventEmitter();
    this.outFocus = new EventEmitter();
   }

  ngOnInit(): void {
    this.lineDrawTool.isUsed[IS_USED.JOINT] = false;
    this.currentLineWidth = this.lineDrawTool.dimensions[DIMENSIONS.LINE_WIDTH].toString();
    this.currentJointWidth = this.lineDrawTool.dimensions[DIMENSIONS.JOINT_RADIUS].toString();
  }

  onWidthSliderChange(value: number): void {
    if (value !== 0) {
      this.lineDrawTool.dimensions[DIMENSIONS.LINE_WIDTH] = value;
      this.currentLineWidth = value.toString();
    }
  }

  onJunctionRadiusSliderChange(value: number): void {
    if (value !== 0) {
      this.lineDrawTool.dimensions[DIMENSIONS.JOINT_RADIUS] = value;
      this.currentJointWidth = value.toString();
    }
  }

  onJunctionToggle(state: boolean): void {
    this.lineDrawTool.isUsed[IS_USED.JOINT] = state;
  }

  onWidthInputChange(value: number): void {
    this.lineDrawTool.dimensions[DIMENSIONS.LINE_WIDTH] = value;
    this.currentLineWidth = value.toString();
  }

  onJunctionRadiusInputChange(value: number): void {
    this.lineDrawTool.dimensions[DIMENSIONS.JOINT_RADIUS] = value;
    this.currentJointWidth = value.toString();
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
    this.currentLineWidth = (this.currentLineWidth === '' ) ? '1' : this.currentLineWidth;
    this.lineDrawTool.dimensions[DIMENSIONS.LINE_WIDTH] = parseInt(this.currentLineWidth, undefined);
    this.currentJointWidth = (this.currentJointWidth === '' ) ? '1' : this.currentJointWidth;
    this.lineDrawTool.dimensions[DIMENSIONS.JOINT_RADIUS] = parseInt(this.currentJointWidth, undefined);
    this.outFocus.emit();
  }

}
