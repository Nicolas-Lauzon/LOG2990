import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadService } from 'src/app/services/automatic-save-service/load-service/load.service';
import { DataService } from '../../../services/data-service/data.service';
import { DRAW_BASE} from './base-draw';
const COLOR_STRING_MAX = 6;
const END_RGB_STRING = 7;
const MENU_WIDTH = 255;

enum ACTIVATION {
  ACTIVATE_DRAWING = 0,
  PALETTE_ACTIVE = 1,
  CUSTOM_VALUE = 2,
  SHOW_ALERT = 3
}

export enum SERVICE_ARRAY_INDEX {
  FORMBUILDER_INDEX = 0,
  DATASERVICE_INDEX = 1,
  DRAW_INDEX = 2,
  ELEMENTREF_INDEX = 3,
  LOAD_INDEX = 4
}

@Component({
  selector: 'app-create-drawing',
  templateUrl: './create-drawing.component.html',
  styleUrls: ['./create-drawing.component.css'],

})
export class CreateDrawingComponent implements OnInit {

  myForm: FormGroup;
  activationTable: boolean[];
  service: [FormBuilder, DataService, string, ElementRef, LoadService];
  @Input() dimensions: [number, number];
  @Input() position: [number, number];
  @Output() createdDraw: EventEmitter<string> = new EventEmitter();
  @Output() closeButton: EventEmitter<boolean>;

  constructor(elementRef: ElementRef, fb: FormBuilder, data: DataService, load: LoadService) {
    this.activationTable = [false, false, false, false];
    this.closeButton = new EventEmitter();
    this.position = [0, 0];
    this.service = [fb, data, '', elementRef, load];
    this.dimensions = [window.innerWidth - MENU_WIDTH, window.innerHeight];

  }

  onSetColor(colorReceived: string): void {
    const rbgOnly: string = colorReceived.substr(1, END_RGB_STRING);
    this.myForm.patchValue({ color: rbgOnly });
    const buttonRef = this.service[SERVICE_ARRAY_INDEX.ELEMENTREF_INDEX].nativeElement.querySelector('#layoutColorButton');
    buttonRef.style.backgroundColor = colorReceived;
  }

  closeColorPalet(): void {
    this.activationTable[ACTIVATION.PALETTE_ACTIVE] = false;
  }

  ngOnInit(): void {
    this.myForm = this.service[SERVICE_ARRAY_INDEX.FORMBUILDER_INDEX].group({
      dimensionsX: [this.dimensions[0], [
        Validators.required,
        Validators.min(1),
        Validators.pattern('^[0-9]*$')
      ]],

      dimensionsY: [this.dimensions[1], [
        Validators.required,
        Validators.min(1),
        Validators.pattern('^[0-9]*$')
      ]],
      color: ['ffffff', [
        Validators.maxLength(COLOR_STRING_MAX),
        Validators.minLength(COLOR_STRING_MAX),
      ]]
    });
    this.service[SERVICE_ARRAY_INDEX.DATASERVICE_INDEX].drawCurrent.subscribe((message) =>
    (this.service[SERVICE_ARRAY_INDEX.DRAW_INDEX] = message));

    this.activationTable[ACTIVATION.ACTIVATE_DRAWING] = (this.service[SERVICE_ARRAY_INDEX.DRAW_INDEX] !== '');
    const appElement = this.service[SERVICE_ARRAY_INDEX.ELEMENTREF_INDEX].nativeElement.querySelector('#content');
    const topDistance: string = 'top: ' + -this.position[0].toString() + 'px; ';
    const leftDistance: string = 'left: ' + -this.position[1].toString() + 'px;';
    const comp = topDistance + leftDistance;
    appElement.setAttribute('style', comp);
  }

  makingForm(): void {
    const mainFrame = document.createElement('div');
    mainFrame.innerHTML = DRAW_BASE;
    const background = mainFrame.querySelector('#background') as SVGElement;
    background.setAttribute('fill', '#' + this.myForm.value.color);
    background.setAttribute('width', this.myForm.value.dimensionsX);
    background.setAttribute('height', this.myForm.value.dimensionsY);
    const draw = mainFrame.querySelector('#drawboard') as SVGElement;
    this.service[SERVICE_ARRAY_INDEX.DATASERVICE_INDEX].changeDimensionX(this.myForm.value.dimensionsX);
    this.service[SERVICE_ARRAY_INDEX.DATASERVICE_INDEX].changeDimensionY(this.myForm.value.dimensionsY);
    this.service[SERVICE_ARRAY_INDEX.DATASERVICE_INDEX].changeColor('#' + this.myForm.value.color);
    this.service[SERVICE_ARRAY_INDEX.DATASERVICE_INDEX].changeDraw(draw.innerHTML);
    this.service[SERVICE_ARRAY_INDEX.LOAD_INDEX].resetToolsIds();
    this.service[SERVICE_ARRAY_INDEX.LOAD_INDEX].automaticSave.firstSave();
    this.createdDraw.emit('');
  }

  get dimensionsX(): AbstractControl | null {
    return this.myForm.get('dimensionsX');
  }
  get dimensionsY(): AbstractControl | null {
    return this.myForm.get('dimensionsY');
  }

  get color(): AbstractControl | null {
    return this.myForm.get('color');
  }

  openPalette(): void {
    if (this.myForm.value.color.length === COLOR_STRING_MAX) {
      this.myForm.value.color = '#' + this.myForm.value.color;
    } else  {
      this.myForm.value.color = '#ffffff';
    }
    this.activationTable[ACTIVATION.PALETTE_ACTIVE] = !this.activationTable[ACTIVATION.PALETTE_ACTIVE];
  }

  customInput(): void {
    this.activationTable[ACTIVATION.CUSTOM_VALUE] = true;
  }

  checkActiveDrawing(): void {
    if (!this.activationTable[ACTIVATION.ACTIVATE_DRAWING]) {
      this.makingForm();
    } else { this.activationTable[ACTIVATION.SHOW_ALERT] = true; }
  }

  @HostListener('window:resize', ['$event'])
  updateValues(): void {
    if (!this.activationTable[ACTIVATION.CUSTOM_VALUE]) {
      this.myForm.patchValue({ dimensionsX: window.innerWidth  - MENU_WIDTH  });
      this.myForm.patchValue({ dimensionsY: window.innerHeight});
    }
  }

  onKeypress(event: KeyboardEvent): boolean {
    const regex = new RegExp('^[a-fA-F0-9]');
    const key = event.key;
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    } else { return true; }
  }
}
