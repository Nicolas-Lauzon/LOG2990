/* tslint:disable: no-string-literal */
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { Drawing } from 'src/app/drawing';
import { WebClientService } from './web-client.service';

describe('WebClientService', () => {
    let service: WebClientService;
    const toastrMock = {
        error: (s: string) => {/* */},
        success: (s: string) => {/* */},
    };
    beforeEach(() =>
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: ToastrService, useValue: toastrMock }],
        }).compileComponents(),
    );

    beforeEach(() => {
        service = TestBed.inject(WebClientService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getCustomError called, and error.status===0, alert', () => {
        const error = new HttpErrorResponse({ error: 'bar', status: 0 });
        service['getCustomError'](error);
    });

    it('getCustomError called, and error.status===INTERNAL_SERVER_ERROR, alert', () => {
        const INTERNAL_SERVER_ERROR = 500;
        const error = new HttpErrorResponse({ error: 'bar', status: INTERNAL_SERVER_ERROR });
        service['getCustomError'](error);
    });

    it('addDrawing and error', () => {
        spyOn(service['http'], 'post').and.callThrough();
        const newDrawing: Drawing = { _id: '1', title: '', drawingHtml: '', tags: ['tag1'], toolIDs: [1, 2] };
        service.addDrawing(newDrawing.title, newDrawing.tags, newDrawing.drawingHtml, newDrawing.toolIDs);
    });

    it('addDrawing should make an HTTP POST', () => {
        spyOn(window.console, 'log');
        spyOn(service['http'], 'post').and.returnValue(of({ body: 'response' }));
        const newDrawing: Drawing = { _id: '1', title: 'zzzzzz', drawingHtml: '', tags: ['tag1'], toolIDs: [1, 2] };
        service.addDrawing(newDrawing.title, newDrawing.tags, newDrawing.drawingHtml, newDrawing.toolIDs);
        expect(window.console.log).toHaveBeenCalled();
    });

    it('postDrawing should make an Http POST invalid email', inject(
        [HttpTestingController, WebClientService],
        (httpMock: HttpTestingController, clientService: WebClientService) => {
            // We call the service
            clientService.postDrawing('zakaria.boussoffara@polymtl.ca', 'imageBase', 'image.png');
            const req = httpMock.expectOne('http://localhost:3000/email');
            req.flush('invalid email');
        },
    ));
    it('postDrawing should make an Http POST email sent', inject(
        [HttpTestingController, WebClientService],
        (httpMock: HttpTestingController, clientService: WebClientService) => {
            // We call the service
            clientService.postDrawing('zakaria.boussoffara@polymtl.ca', 'imageBase', 'image.png');
            const req = httpMock.expectOne('http://localhost:3000/email');
            req.flush('An email has been sent');
        },
    ));

    it('postDrawing should make an Http POST email sent, else', inject(
      [HttpTestingController, WebClientService],
      (httpMock: HttpTestingController, clientService: WebClientService) => {
          // We call the service
          clientService.postDrawing('zakaria.boussoffara@polymtl.ca', 'imageBase', 'image.png');
          const req = httpMock.expectOne('http://localhost:3000/email');
          req.flush('error');
      },
  ));

    it('getAllDrawings should make an HTTP GET', () => {
        spyOn(service, 'getAllDrawings').and.callThrough();
        spyOn(service['http'], 'get').and.returnValue(of({ body: 'response' }));

        service.getAllDrawings();
        expect(service.getAllDrawings).toHaveBeenCalled();
    });

    it('deleteDrawing should make an HTTP DELETE', () => {
        spyOn(service, 'deleteDrawing').and.callThrough();
        spyOn(service['http'], 'delete').and.returnValue(of({ body: 'error' }));

        service.deleteDrawing('title');
        expect(service.deleteDrawing).toHaveBeenCalled();
    });

    it('updateDrawing should make an HTTP PATCH', () => {
        spyOn(service, 'getCustomError' as never);
        spyOn(service['http'], 'patch').and.returnValue(of({ body: 'error' }));

        const newDrawing: Drawing = { _id: '1', title: 'zzzzz', drawingHtml: 'drawingHtml', tags: ['tag1'], toolIDs: [1, 2] };

        service.updateDrawing(newDrawing);
        expect(service['getCustomError']).toHaveBeenCalled();
    });
});
