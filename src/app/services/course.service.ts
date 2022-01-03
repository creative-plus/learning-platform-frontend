import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Course } from '../lib/models/course/Course';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private auth: AuthService, private http: HttpClient, private snackbar: MatSnackBar) { }

  getAllCourses(): Observable<Course[]> {
    const url = `${environment.apiUrl}/courses`;
    return this.http.get<Course[]>(url, this.auth.getPrivateHeaders());
  }

  getCourse(id: number): Observable<Course> {
    const url = `${environment.apiUrl}/courses/${id}`;
    return this.http.get<Course>(url, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Course>('getCourse', undefined))
    );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackbar.open(error?.error.message || 'Something went wrong.');
      return of(result as T);
    };
  }
}
