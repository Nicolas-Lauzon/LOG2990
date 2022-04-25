import { Component, ElementRef,  EventEmitter, Output, ViewChild} from '@angular/core';
import { ColorService } from 'src/app/services/color-service/color-service.service';
import { DrawBoardStateService } from 'src/app/services/draw-board-state/draw-board-state.service';
import { DataService } from '../../../../../services/data-service/data.service';

export enum COLOR_INFO {
  ACTIVE_PALET = 0,
  CURRENT_COLOR = 1,
  CURRENT_PRIMARY_TRANSPARENCY = 2,
  CURRENT_SECONDARY_TRANSPARENCY = 3,
}

const INITIAL_TRANSPARENCY = 100;
@Component({
  selector: 'app-color-menu',
  templateUrl: './color-menu.component.html',
  styleUrls: ['./color-menu.component.css']
})
export class ColorMenuComponent {

  @ViewChild('colorMenu', { static: false })
  colorMenu: ElementRef;

  @Output() focus: EventEmitter<boolean>;
  @Output() outFocus: EventEmitter<boolean>;

  private dataService: DataService;
  colorSelection: ColorService;
  private drawBoardService: DrawBoardStateService;

  private colorInformations: [number, string, number, number];

  constructor(colorService: ColorService, dataService: DataService, drawBoardService: DrawBoardStateService) {
    this.colorSelection = colorService;
    this.dataService = dataService;
    this.dataService.colorCurrent.subscribe((message) => (this.colorSelection.backgroundColor = message));
    this.colorInformations = [0, '', INITIAL_TRANSPARENCY, INITIAL_TRANSPARENCY];
    this.colorInformations[COLOR_INFO.ACTIVE_PALET] = 0;
    this.colorInformations[COLOR_INFO.CURRENT_COLOR] = '';
    this.colorInformations[COLOR_INFO.CURRENT_PRIMARY_TRANSPARENCY] = INITIAL_TRANSPARENCY;
    this.colorInformations[COLOR_INFO.CURRENT_SECONDARY_TRANSPARENCY] = INITIAL_TRANSPARENCY;
    this.focus = new EventEmitter();
    this.outFocus = new EventEmitter();
    this.drawBoardService = drawBoardService;
  }

  openColorPalet(index: number): void {
    const background = 3;
    this.colorInformations[COLOR_INFO.ACTIVE_PALET] = index;
    switch (index) {
      case 1:
        this.colorInformations[COLOR_INFO.CURRENT_COLOR] = this.colorSelection.primaryColor;
        break;
      case 2:
        this.colorInformations[COLOR_INFO.CURRENT_COLOR] = this.colorSelection.secondaryColor;
        break;
      case background:
        this.colorInformations[COLOR_INFO.CURRENT_COLOR] = this.colorSelection.backgroundColor;
        break;
    }
  }

  onSetPrimaryTransparency(value: number): void {
    this.colorInformations[COLOR_INFO.CURRENT_PRIMARY_TRANSPARENCY] = value;
    this.colorSelection.setPrimaryTransparancy(this.colorInformations[COLOR_INFO.CURRENT_PRIMARY_TRANSPARENCY]);
  }
  onSetSecondaryTransparency(value: number): void {
    this.colorInformations[COLOR_INFO.CURRENT_SECONDARY_TRANSPARENCY] = value;
    this.colorSelection.setSecondaryTransparancy(this.colorInformations[COLOR_INFO.CURRENT_SECONDARY_TRANSPARENCY]);
  }

  onSetQuickColor(color: [number, string]): void {
    const pastIndex = this.colorInformations[COLOR_INFO.ACTIVE_PALET];
    this.colorInformations[COLOR_INFO.ACTIVE_PALET] = color[0];
    this.onSetColor(color[1]);
    this.colorInformations[COLOR_INFO.ACTIVE_PALET] = pastIndex;
  }

  onSwitchColor(): void {
    this.colorSelection.switchColors();
    this.colorMenu.nativeElement.querySelector('#primaryColorView').style.backgroundColor = this.colorSelection.primaryColor;
    this.colorMenu.nativeElement.querySelector('#secondaryColorView').style.backgroundColor = this.colorSelection.secondaryColor;
    this.openColorPalet(this.colorInformations[COLOR_INFO.ACTIVE_PALET]);
  }

  onSetColor(color: string): void {
    if (this.colorInformations[COLOR_INFO.ACTIVE_PALET] === 1) {
      this.colorSelection.setPrimary(color);
      this.colorMenu.nativeElement.querySelector('#primaryColorView').style.backgroundColor = color;
      this.colorInformations[COLOR_INFO.CURRENT_COLOR] = color;
    } else if (this.colorInformations[COLOR_INFO.ACTIVE_PALET] === 2) {
      this.colorSelection.setSecondary(color);
      this.colorMenu.nativeElement.querySelector('#secondaryColorView').style.backgroundColor = color;
      this.colorInformations[COLOR_INFO.CURRENT_COLOR] = color;
    } else {
      this.colorSelection.backgroundColor = color;
      this.colorMenu.nativeElement.querySelector('#backgroundColorView').style.backgroundColor = color;
      this.dataService.changeColor(color);
      if (this.drawBoardService.drawboard ) {
        const background = this.drawBoardService.drawboard.querySelector('#background');
        if (background) {
          background.setAttribute('fill', color);
        }
      }
    }
  }

  closeColorPalet(): void {
    this.colorInformations[COLOR_INFO.ACTIVE_PALET] = 0;
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
    this.colorInformations[COLOR_INFO.CURRENT_PRIMARY_TRANSPARENCY] =
      (this.colorInformations[COLOR_INFO.CURRENT_PRIMARY_TRANSPARENCY] < 1) ?
        1 : this.colorInformations[COLOR_INFO.CURRENT_PRIMARY_TRANSPARENCY];

    this.colorSelection.setPrimaryTransparancy(this.colorInformations[COLOR_INFO.CURRENT_PRIMARY_TRANSPARENCY]);

    this.colorInformations[COLOR_INFO.CURRENT_SECONDARY_TRANSPARENCY] =
      (this.colorInformations[COLOR_INFO.CURRENT_SECONDARY_TRANSPARENCY] < 1) ?
        1 : this.colorInformations[COLOR_INFO.CURRENT_SECONDARY_TRANSPARENCY];
    this.colorSelection.setSecondaryTransparancy(this.colorInformations[COLOR_INFO.CURRENT_SECONDARY_TRANSPARENCY]);

    this.outFocus.emit();
  }
}
