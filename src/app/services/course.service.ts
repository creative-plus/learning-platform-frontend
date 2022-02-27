import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Course } from '../lib/models/course/Course';
import { CourseRegistration } from '../lib/models/course/CourseRegistration';
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

  getAllCoursesWithRegistration(): Observable<Course[]> {
    const url = `${environment.apiUrl}/courses/with-enrollment`;
    return this.http.get<Course[]>(url, this.auth.getPrivateHeaders());
  }

  addCourse(course: Course): Observable<Course> {
    const url = `${environment.apiUrl}/courses/`;
    return this.http.post<Course>(url, course, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Course>('addCourse', null))
    );
  }

  getCourse(id: number): Observable<Course> {
    const url = `${environment.apiUrl}/courses/${id}`;
    return this.http.get<Course>(url, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Course>('getCourse', null))
    );
  }

  editCourse(id: number, course: Course): Observable<Course> {
    const url = `${environment.apiUrl}/courses/${id}`;
    return this.http.put<Course>(url, course, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Course>('editCourse', null))
    );
  }

  deleteCourse(id: number): Observable<boolean> {
    const url = `${environment.apiUrl}/courses/${id}`;
    return this.http.delete(url, this.auth.getPrivateHeaders()).pipe(
      map(_ => true),
      catchError(this.handleError<boolean>('deleteCourse', false))
    );
  }

  enrollToCourse(id: number): Observable<CourseRegistration> {
    const url = `${environment.apiUrl}/courses/${id}/enrollment`;
    return this.http.post<CourseRegistration>(url, {}, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<CourseRegistration>('enrollToCourse', null))
    );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackbar.open(error?.error.message || 'Something went wrong.');
      return of(result as T);
    };
  }
}
