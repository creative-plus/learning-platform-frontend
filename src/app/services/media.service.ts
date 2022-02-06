import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MediaMeta } from '../lib/models/MediaMeta';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private auth: AuthService, private http: HttpClient, private snackbar: MatSnackBar) { }

  public uploadFile(file: File): Observable<MediaMeta> {
    const url = `${environment.apiUrl}/media/`;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<MediaMeta>(url, formData, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<MediaMeta>('uploadFile', null))
    );
  }

  public getFileMeta(fileId: string) {
    const url = `${environment.apiUrl}/media/${fileId}/meta`;
    return this.http.get<MediaMeta>(url, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<MediaMeta>('getFileMeta', null))
    );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackbar.open(error?.error.message || 'Something went wrong.');
      return of(result as T);
    };
  }
}
