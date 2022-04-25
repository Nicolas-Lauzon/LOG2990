import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DrawingService } from 'src/app/services/drawing-service/drawing.service';
import { ExportDrawingService } from 'src/app/services/export-drawing-service/export-drawing.service';
const N_FILTER = 5;
enum CLICKED {
    SVG = 0,
    PNG = 1,
    JPG = 2,
    EMAIL = 3,
}
enum SERVICES {
    EXPORT_DRAWING = 0,
    DRAWING = 1,
}
@Component({
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.css'],
})
export class ExportComponent implements AfterViewInit {
    clickedTable: boolean[];
    private serviceTable: [ExportDrawingService, DrawingService];
    filters: boolean[];
    @Output() exportDraw: EventEmitter<boolean> = new EventEmitter();
    @Input() position: [number, number];

    @ViewChild('content', { static: false })
    private elementRef: ElementRef;

    constructor(exportDrawing: ExportDrawingService, drawing: DrawingService, private toastr: ToastrService) {
        this.serviceTable = [exportDrawing, drawing];
        this.clickedTable = [false, false, false, false];
        this.filters = new Array(N_FILTER).fill(false);

        this.position = [0, 0];
    }

    ngAfterViewInit(): void {
        this.serviceTable[SERVICES.EXPORT_DRAWING].drawingElem = (this.serviceTable[SERVICES.DRAWING].svg as SVGSVGElement).cloneNode(
            true,
        ) as SVGSVGElement;
        const imageRef = this.elementRef.nativeElement.querySelector('#image');
        imageRef.src = this.serviceTable[SERVICES.EXPORT_DRAWING].getThumbnail();

        const appElement = this.elementRef.nativeElement as HTMLElement;
        const topDistance: string = 'top: ' + -this.position[0].toString() + 'px; ';
        const leftDistance: string = 'left: ' + -this.position[1].toString() + 'px;';
        const comp = topDistance + leftDistance;
        appElement.setAttribute('style', comp);
    }

    exportDrawingButton(): void {
        const nameRef = this.elementRef.nativeElement.querySelector('#name');
        const emailRef = this.elementRef.nativeElement.querySelector('#email');
        let emailVerified = false;
        if (this.clickedTable[CLICKED.EMAIL]) {
            emailVerified = this.verifyEmail((emailRef as HTMLInputElement).value);
        }
        this.serviceTable[SERVICES.EXPORT_DRAWING].setName((nameRef as HTMLInputElement).value);
        if (this.clickedTable[CLICKED.EMAIL] && emailVerified) {
            this.serviceTable[SERVICES.EXPORT_DRAWING].setEmail((emailRef as HTMLInputElement).value);
        }
        if (this.clickedTable[CLICKED.JPG]) {
            this.serviceTable[SERVICES.EXPORT_DRAWING].transformToJPG(emailVerified);
        }
        if (this.clickedTable[CLICKED.PNG]) {
            this.serviceTable[SERVICES.EXPORT_DRAWING].transformToPNG(emailVerified);
        }
        if (this.clickedTable[CLICKED.SVG]) {
            this.serviceTable[SERVICES.EXPORT_DRAWING].transformToSVG(emailVerified);
        }
    }
    changeJPG(): void {
        this.clickedTable[CLICKED.JPG] = !this.clickedTable[CLICKED.JPG];
    }
    changeEmail(): void {
        this.clickedTable[CLICKED.EMAIL] = !this.clickedTable[CLICKED.EMAIL];
    }
    changePNG(): void {
        this.clickedTable[CLICKED.PNG] = !this.clickedTable[CLICKED.PNG];
    }
    changeSVG(): void {
        this.clickedTable[CLICKED.SVG] = !this.clickedTable[CLICKED.SVG];
    }
    verifyEmail(email: string): boolean {
        if (email.includes('@') && email.includes('.')) {
            return true;
        } else {
            this.toastr.error("Adresse email incorrecte! Veuillez l'entrez correctement pour recevoir l'image par courriel");
            return false;
        }
    }
    applyFilter(index: number): void {
        if (this.filters[index]) {
            this.serviceTable[SERVICES.EXPORT_DRAWING].addFilter(index);
            this.changeThumbnail();
        } else if (!this.filters[index]) {
            this.serviceTable[SERVICES.EXPORT_DRAWING].removeFilter(index);
            this.changeThumbnail();
        }
    }

    changeFilter(index: number): void {
        const oldValue = this.filters[index];
        this.filters.fill(false);
        this.filters[index] = !oldValue;
    }

    private changeThumbnail(): void {
        const imageRef = this.elementRef.nativeElement.querySelector('#image');
        imageRef.src = this.serviceTable[SERVICES.EXPORT_DRAWING].getThumbnail();
    }
    validateForm(event: KeyboardEvent): boolean {
        const regex = new RegExp('^[a-zA-Z0-9]*$');
        const key = event.key;
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        } else {
            return true;
        }
    }
}
