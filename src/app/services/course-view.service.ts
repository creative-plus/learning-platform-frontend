import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AbstractCourseViewService, QuizWrongAnswerResponse } from '../lib/abstract/AbstractCourseViewService';
import { Course } from '../lib/models/course/Course';
import { CourseSection } from '../lib/models/course/course-sections/CourseSection';
import { QuizAnswers } from '../lib/models/course/course-sections/quiz/quiz-answers/QuizAnswers';
import { CourseRegistration } from '../lib/models/course/CourseRegistration';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CourseViewService implements AbstractCourseViewService {

  constructor(private auth: AuthService, private http: HttpClient, private snackbar: MatSnackBar) { }

  getCourse(courseId: number): Observable<Course> {
    const url = `${environment.apiUrl}/courses/${courseId}`;
    return this.http.get<Course>(url, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Course>('getCourse', null))
    );;
  }

  getCourseRegistration(courseId: number): Observable<CourseRegistration> {
    const url = `${environment.apiUrl}/courses/${courseId}/enrollment`;
    return this.http.get<CourseRegistration>(url, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<CourseRegistration>('getCourseRegistration', null))
    );;
  }

  passSection(courseId: number, sectionId: number, quizAnswers?: QuizAnswers): Observable<CourseRegistration | QuizWrongAnswerResponse> {
    const url = `${environment.apiUrl}/courses/${courseId}/enrollment/sections/${sectionId}`;
    return this.http.post<CourseRegistration>(url, quizAnswers, this.auth.getPrivateHeaders()).pipe(
      catchError(error => {
        if(error.error?.code == "WrongQuizAnswerException") {
          return of(error.error as QuizWrongAnswerResponse)
        } else {
          throw error;
        }
      }),
      catchError(this.handleError<CourseRegistration>('passSection', null))
    );;
  }

  getSection(courseId: number, sectionId: number): Observable<CourseSection> {
    const url = `${environment.apiUrl}/courses/${courseId}/sections/${sectionId}`;
    return this.http.get<CourseSection>(url, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<CourseSection>('getSection', null))
    );;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackbar.open(error?.error.message || 'Something went wrong.');
      return of(result as T);
    };
  }
}
