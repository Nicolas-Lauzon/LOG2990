import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { DrawStrategyPencilService } from 'src/app/services/draw-strategy/draw-strategy-pencil/draw-strategy-pencil.service';

@Component({
  selector: 'app-attributes-pencil',
  templateUrl: './attributes-pencil.component.html',
  styleUrls: ['./attributes-pencil.component.css']
})
export class AttributesPencilComponent implements OnInit {
  drawPencilTool: DrawStrategyPencilService;
  currentWidth: string;

  @Output() focus: EventEmitter<boolean>;
  @Output() outFocus: EventEmitter<boolean>;

  constructor(drawPencilTool: DrawStrategyPencilService) {
   this.drawPencilTool = drawPencilTool;
   this.focus = new EventEmitter();
   this.outFocus = new EventEmitter();
   }

  ngOnInit(): void {
    this.currentWidth = this.drawPencilTool.width.toString();
  }

  onWidthSliderChange(value: number): void {
    if (value !== 0) {
      this.drawPencilTool.width = value;
      this.currentWidth = value.toString();
    }
  }

  onWidthInputChange(value: number): void {
    this.drawPencilTool.width = value;
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

    this.currentWidth = (this.currentWidth === '' ) ? '1' : this.currentWidth;
    this.drawPencilTool.width = parseInt(this.currentWidth, undefined);

    this.outFocus.emit();
  }

}
