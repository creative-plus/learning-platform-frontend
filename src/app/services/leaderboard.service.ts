import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LeaderboardTrainee } from '../lib/models/LeaderboardTrainee';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  constructor(private auth: AuthService, private http: HttpClient, private snackbar: MatSnackBar) { }

  public getLeaderboard(options: GetLeaderboardOptions): Observable<LeaderboardTrainee[]> {
    let url = `${environment.apiUrl}/leaderboard/`;
    if(options.projectId) {
      url += `project/${options.projectId}/`;
    }
    if(options.courseId) {
      url += `course/${options.courseId}/`;
    }
    return this.http.get<LeaderboardTrainee[]>(url, this.auth.getPrivateHeaders()).pipe(
      catchError(this.handleError<LeaderboardTrainee[]>('getLeaderboard', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackbar.open(error?.error.message || 'Something went wrong.');
      return of(result as T);
    };
  }
}

export interface GetLeaderboardOptions {
  projectId: number;
  courseId: number;
}
