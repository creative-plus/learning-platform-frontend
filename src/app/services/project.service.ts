import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Project } from '../lib/models/Project';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private auth: AuthService, private http: HttpClient, private snackbar: MatSnackBar) { }

  getProjects(): Observable<Project[]> {
    const url = `${environment.apiUrl}/projects/`;
    return this.http.get<Project[]>(url, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Project[]>('getProjects', []))
    );
  }

  addProject(project: Project): Observable<Project> {
    const url = `${environment.apiUrl}/projects/`;
    return this.http.post<Project>(url, project, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Project>('addProject', null))
    );
  }

  editProject(project: Project): Observable<Project> {
    const url = `${environment.apiUrl}/projects/${project.id}`;
    return this.http.put<Project>(url, project, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<Project>('editProject', null))
    );
  }

  deleteProject(project: Project): Observable<boolean> {
    const url = `${environment.apiUrl}/projects/${project.id}`;
    return this.http.delete<any>(url, this.auth.getPrivateHeaders()).pipe(
      map(_ => true),
      catchError(this.handleError<boolean>('deleteProject', false))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackbar.open(error?.error.message || 'Something went wrong.');
      return of(result as T);
    };
  }
}
