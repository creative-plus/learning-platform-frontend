import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Trainee, TraineeRequest } from '../lib/models/user/Trainee';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TraineeService {

  constructor(private auth: AuthService, private http: HttpClient, private snackbar: MatSnackBar) { }

  getTrainees(): Observable<Trainee[]> {
    const url = `${environment.apiUrl}/trainees/`;
    return this.http.get<Trainee[]>(url, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Trainee[]>('getTrainees', []))
    );
  }

  addTrainee(project: TraineeRequest): Observable<Trainee> {
    const url = `${environment.apiUrl}/trainees/`;
    return this.http.post<Trainee>(url, project, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Trainee>('addTrainee', null))
    );
  }

  editTrainee(project: TraineeRequest): Observable<Trainee> {
    const url = `${environment.apiUrl}/trainees/${project.id}`;
    return this.http.put<Trainee>(url, project, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Trainee>('editTrainee', null))
    );
  }

  deleteTrainee(project: TraineeRequest): Observable<boolean> {
    const url = `${environment.apiUrl}/trainees/${project.id}`;
    return this.http.delete<any>(url, this.auth.getPrivateHeaders()).pipe(
      map(_ => true),
      catchError(this.handleError<boolean>('deleteTrainee', false))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackbar.open(error?.error.message || 'Something went wrong.');
      return of(result as T);
    };
  }
}
