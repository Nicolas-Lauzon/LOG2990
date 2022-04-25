import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GridService } from './../../../../../../services/grid-service/grid.service';

const PERCENTAGE = 100;

@Component({
  selector: 'app-attributes-grid',
  templateUrl: './attributes-grid.component.html',
  styleUrls: ['./attributes-grid.component.scss']
})

export class AttributesGridComponent implements OnInit {
  grid: GridService;
  transparency: number;
  size: number;

  @Output() focus: EventEmitter<boolean>;
  @Output() outFocus: EventEmitter<boolean>;

  constructor(grid: GridService) {
    this.grid = grid;
    this.focus = new EventEmitter();
    this.outFocus = new EventEmitter();
  }

  ngOnInit(): void {
    this.size = this.grid.size;
    this.transparency = this.grid.transparency * PERCENTAGE;

  }

  onGridToggle(): void {
    this.grid.activateGrid();
    this.grid.showGrid();

  }

  onTransparencyChange(value: number): void {
    if (value !== 0) {
      this.transparency = value;
      this.grid.transparency = value / PERCENTAGE;
      this.grid.makeGrid();
    }
    this.grid.showGrid();

  }

  onSizeChange(value: number): void {
    if (value !== 0) {
      this.size = value;
      this.grid.size = value;
      this.grid.makeGrid();
    }
    if (this.grid.isActive) {
      this.grid.showGrid();
    }
  }

  onSizeChangeInput(value: string): void {
    this.size = parseInt(value, undefined);

    this.grid.size = parseInt(value, undefined);

    this.grid.makeGrid();
    if (this.grid.isActive) {
      this.grid.showGrid();
    }
  }

  onTransparencyChangeInput(value: number): void {

    this.transparency = value;
    this.grid.transparency = value / PERCENTAGE;
    this.grid.makeGrid();
    this.grid.showGrid();

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
    const minTransparency = 10;
    const minSize = 5;
    this.transparency = (this.transparency < minTransparency) ? minTransparency : this.transparency;
    this.grid.transparency = this.transparency / PERCENTAGE;

    this.size = (this.size < minSize) ? minSize : this.size;
    this.grid.size = this.size;

    this.outFocus.emit();
  }
}
