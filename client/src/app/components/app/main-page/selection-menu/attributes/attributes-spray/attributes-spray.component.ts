import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DrawStrategySprayService } from './../../../../../../services/draw-strategy/draw-startegy-spray/draw-strategy-spray.service';
import { IntervalService } from './../../../../../../services/interval-service/interval.service';

@Component({
  selector: 'app-attributes-spray',
  templateUrl: './attributes-spray.component.html',
  styleUrls: ['./attributes-spray.component.css']
})
export class AttributesSprayComponent implements OnInit {
  sprayTool: DrawStrategySprayService;
  currentWidth: string;
  spraysPerSeconds: string;
  interval: IntervalService;

  @Output() focus: EventEmitter<boolean>;
  @Output() outFocus: EventEmitter<boolean>;

  constructor(drawPencilTool: DrawStrategySprayService, interval: IntervalService) {
   this.sprayTool = drawPencilTool;
   this.interval = interval;
   this.focus = new EventEmitter();
   this.outFocus = new EventEmitter();
   }

  ngOnInit(): void {
    this.currentWidth = this.sprayTool.atributes[0].toString();
    this.spraysPerSeconds = this.sprayTool.atributes[1].toString();
    this.interval.setInterval(parseInt(this.spraysPerSeconds, undefined));

  }

  onWidthSliderChange(value: number): void {
    if (value !== 0) {
      this.sprayTool.atributes[0] = value;
      this.currentWidth = value.toString();
    }
  }

  onSpraysPerSecondSliderChange(value: number): void {
    if (value !== 0) {
      this.spraysPerSeconds = value.toString();
      this.sprayTool.atributes[1] = value;
      this.interval.setInterval(value);
    }
  }

  onWidthInputChange(value: number): void {
    this.sprayTool.atributes[0] = value;
    this.currentWidth = value.toString();
  }

  onSprayInpuchange(value: number): void {
    this.spraysPerSeconds = value.toString();
    this.sprayTool.atributes[1] = value;
    this.interval.setInterval(value);
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
    this.sprayTool.atributes[0] = parseInt(this.currentWidth, undefined);

    this.spraysPerSeconds = (this.spraysPerSeconds === '' ) ? '1' : this.spraysPerSeconds;
    this.sprayTool.atributes[1] = parseInt(this.spraysPerSeconds, undefined);
    this.interval.setInterval(parseInt(this.spraysPerSeconds, undefined));

    this.outFocus.emit();
  }

}
