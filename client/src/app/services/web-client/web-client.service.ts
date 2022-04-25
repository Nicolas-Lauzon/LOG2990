import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Drawing } from 'src/app/drawing';

const INTERNAL_SERVER_ERROR = 500;

@Injectable({
    providedIn: 'root',
})
export class WebClientService {
    private readonly DATABASE_URL: string = 'http://localhost:3000/database';
    private readonly EMAIL_URL: string = 'http://localhost:3000/email';
    constructor(private http: HttpClient, private toastr: ToastrService) {}

    addDrawing(titleDrawing: string, tagsDrawing: string[], drawingHtmlDrawing: string, drawingToolsIDs: number[]): void {
        this.http
            .post(`${this.DATABASE_URL}/drawings/`, {
                title: titleDrawing,
                tags: tagsDrawing,
                drawingHtml: drawingHtmlDrawing,
                toolIDs: drawingToolsIDs,
            })
            .subscribe(
                (response: Response) => {
                    console.log(response.body);
                }
            );
    }

    postDrawing(emailClient: string, directory: string, name: string): void {
        this.http
            .post(`${this.EMAIL_URL}`, {
                email: emailClient,
                directoryImage: directory,
                nameExtension: name,
            })
            .subscribe(
                (response) => {
                  if (response.toString().includes('invalid email')) {
                    this.toastr.error('Adresse courriel n\'existe pas');
                } else if (response.toString().includes('An email has been sent')) {
                    this.toastr.success('Le dessin a été envoyé par email!');
                } else {
                  this.toastr.error('Une erreur est survenue');
              }
                }
            );
    }

    getAllDrawings(): Observable<Drawing[]> {
        return this.http.get<Drawing[]>(`${this.DATABASE_URL}/drawings`).pipe(catchError(this.getCustomError));
    }

    deleteDrawing(id: string): Observable<void> {
        return this.http.delete<void>(`${this.DATABASE_URL}/drawings/${id}`).pipe(catchError(this.getCustomError));
    }

    updateDrawing(drawing: Drawing): void {
        this.http
            .patch(`${this.DATABASE_URL}/drawings/`, JSON.stringify(drawing), { headers: { 'Content-Type': 'application/json' } })
            .subscribe((error: HttpErrorResponse) => this.getCustomError(error));
    }

    private getCustomError(error: HttpErrorResponse): Observable<never> {
        if (error.status === 0) {
          this.toastr.error('La connection avec le serveur a été perdu');
        } else if (error.status === INTERNAL_SERVER_ERROR) {
            this.toastr.error('Le dessin est invalid, verifiez les variables');
        }
        return throwError(error.message);
    }
}
