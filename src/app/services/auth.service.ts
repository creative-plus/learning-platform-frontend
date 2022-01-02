import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../lib/models/auth/AuthResponse';
import { AuthUser } from '../lib/models/auth/AuthUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userDataSource: ReplaySubject<AuthUser | undefined> = new ReplaySubject<AuthUser | undefined>(1);
  userData = this.userDataSource.asObservable();

  constructor(private http: HttpClient, private snackbar: MatSnackBar) {
    if(this.isSignedIn()) {
      this.getAuthUser().subscribe(res => {
        this.userDataSource.next(res);
      })
    } else {
      this.userDataSource.next(undefined);
    }
  }

  private setToken(token : string) {
    return localStorage.setItem('token', token);
  }

  private removeToken() {
    return localStorage.removeItem('token');
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  isSignedIn(): boolean {
    return this.getToken() != null;
  }

  signOut() {
    this.removeToken();
    this.userDataSource.next();
  }

  getAuthUser(): Observable<AuthUser | undefined> {
    const url = `${environment.apiUrl}/auth/user`;
    return this.http.get<AuthUser>(url, this.getPrivateHeaders()).pipe(
      catchError(() => {
        this.signOut();
        return of(undefined);
      })
    );
  }

  signInWithEmailAndPassword(email: string, password: string) : Observable<AuthResponse> {
    const url = `${environment.apiUrl}/auth/login`;
    return this.http.post<AuthResponse>(url, { email, password }).pipe(
      map(res => {
        this.setToken(<string>res.token);
        this.userDataSource.next(res.user);
        return res;
      }),
      catchError(this.handleAuthError('signInWithEmailAndPassword'))
    );
  }

  getPrivateHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.getToken(),
      }),
      withCredentials: false,
    };
  }

  private handleAuthError(result?: any) {
    return (error: HttpErrorResponse): Observable<AuthResponse> => {
      this.snackbar.open(error.error?.message || "A apărut o eroare.");
      return of({ error: error.error.name || true } as AuthResponse);
    };
  }
}
