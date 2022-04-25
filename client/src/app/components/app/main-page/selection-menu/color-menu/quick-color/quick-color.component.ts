import { Component, EventEmitter,
        Input, Output } from '@angular/core';

const N_RECENT_COLOR = 10;

@Component({
  selector: 'app-quick-color',
  templateUrl: './quick-color.component.html',
  styleUrls: ['./quick-color.component.css']
})
export class QuickColorComponent {
  @Input() recentColors: string[];
  @Output() setQuickColor: EventEmitter<unknown> = new EventEmitter();

  constructor() {
    this.setQuickColor = new EventEmitter();
    this.recentColors = new Array<string>();
    this.setQuickColor = new EventEmitter();
    for (let i = 0; i < N_RECENT_COLOR; i++) {
      this.recentColors.push('#FFFFFFFF');
    }
  }

  onClick(mouseEvent: MouseEvent, index: number): boolean {

    if (mouseEvent.button === 0) {
      this.setQuickColor.emit([1, this.recentColors[index]]);
    } else if (mouseEvent.button === 2) {
      this.setQuickColor.emit([2, this.recentColors[index]]);
    }

    return false;
  }

}
