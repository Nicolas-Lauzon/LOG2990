import { Injectable } from '@angular/core';
import { WebClientService } from '../web-client/web-client.service';
import { DataService } from './../data-service/data.service';
import { GridService } from './../grid-service/grid.service';
const DELAY = 500;
@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    drawingElem: SVGSVGElement;
    private grid: GridService;
    private img: string[];
    private data: DataService;
    private name: string;
    private email: string;
    private http: WebClientService;

    setName(name: string): void {
        this.name = name;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    constructor(grid: GridService, data: DataService, http: WebClientService) {
        this.data = data;
        this.grid = grid;
        this.img = new Array<string>(2);
        this.name = 'drawing';
        this.http = http;
    }

    transformToJPG(emailEnabled: boolean): void {
        this.removeGrid();

        let width = 0;
        let height = 0;
        this.data.dimensionXCurrent.subscribe((message) => (width = message));
        this.data.dimensionYCurrent.subscribe((message) => (height = message));

        const canvas = document.createElement('canvas');
        canvas.style.display = 'hidden';
        canvas.width = width;
        canvas.height = height;
        document.body.appendChild(canvas);

        const image = new Image();
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const str = this.drawingElem.outerHTML;
        const svg = new Blob([str], { type: 'image/svg+xml' });
        const DOMURL = window.URL || window;
        const url = DOMURL.createObjectURL(svg);
        image.src = url;
        const load = (image.onload = () => {
            ctx.drawImage(image, 0, 0);
            this.img[0] = canvas.toDataURL('image/jpeg');
        });
        load();
        setTimeout(() => {
            const imageDrawing = this.img[0].split(',');
            this.downloadPopUp(this.img[0], '.jpg', imageDrawing[1], emailEnabled);
            document.body.removeChild(canvas);
        }, DELAY);
    }
    transformToPNG(emailEnabled: boolean): void {
        this.removeGrid();

        let width = 0;
        let height = 0;
        this.data.dimensionXCurrent.subscribe((message) => (width = message));
        this.data.dimensionYCurrent.subscribe((message) => (height = message));

        const canvas = document.createElement('canvas');
        canvas.style.display = 'hidden';
        canvas.width = width;
        canvas.height = height;
        document.body.appendChild(canvas);

        const image = new Image();
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const str = this.drawingElem.outerHTML;
        const svg = new Blob([str], { type: 'image/svg+xml' });
        const DOMURL = window.URL || window;
        const url = DOMURL.createObjectURL(svg);
        image.src = url;
        const load = (image.onload = () => {
            ctx.drawImage(image, 0, 0);
            this.img[1] = canvas.toDataURL('image/png');
        });
        load();
        setTimeout(() => {
            const imageDrawing = this.img[1].split(',');
            this.downloadPopUp(this.img[1], '.png', imageDrawing[1], emailEnabled);
            document.body.removeChild(canvas);
        }, DELAY);
    }
    transformToSVG(emailEnabled: boolean): void {
        this.removeGrid();

        const str = this.drawingElem.outerHTML;
        const svg = new Blob([str], { type: 'image/svg+xml' });
        const DOMURL = window.URL || window;
        const url = DOMURL.createObjectURL(svg);
        this.downloadPopUp(url, '.svg', str, emailEnabled);
    }

    addFilter(index: number): void {
        const filterIndex = 6;
        const filter: number = index + filterIndex;
        (this.drawingElem.querySelector('#drawboard') as HTMLElement).style.filter = 'url(#filter' + filter + ')';
    }
    removeFilter(index: number): void {
        (this.drawingElem.querySelector('#drawboard') as HTMLElement).style.filter = '';
    }
    getThumbnail(): string {
        this.removeGrid();

        return 'data:image/svg+xml;base64,' + btoa(this.drawingElem.outerHTML);
    }

    private removeGrid(): void {
        if (this.grid.isActive) {
            (this.drawingElem.querySelector('#grid') as HTMLElement).innerHTML = '';
        }
    }
    private downloadPopUp(url: string, ext: string, imageEmail: string, emailEnabled: boolean): HTMLAnchorElement {
        const element = document.createElement('a');
        document.body.appendChild(element);
        if (this.name === '') {
            this.setName('default');
        }
        element.download = this.name + ext;
        element.href = url;
        if (emailEnabled) {
            this.http.postDrawing(this.email, imageEmail, element.download);
        }
        element.click();
        document.body.removeChild(element);
        return element;
    }
}
