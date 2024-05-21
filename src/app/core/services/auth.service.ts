import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, shareReplay, tap } from 'rxjs';
import { format, parseISO, isBefore } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = '';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.url}authenticate`, { email, password }, { ...this.httpOptions, observe: 'response' }).pipe(
      tap(res => this.setSession(res)),
      shareReplay(),
      catchError(this.handleError<any>('login'))
    );
  }

  signUp(user: any, question: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.url}signup`, { user, question }, { ...this.httpOptions, observe: 'response' }).pipe(
      catchError(this.handleError<any>('signUp'))
    );
  }

  recoverPassword(email: string, question_id: number, answer: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.url}authenticate/recoverpwd`, { email, question_id, answer }, { ...this.httpOptions, observe: 'response' }).pipe(
      catchError(this.handleError<any>('recoverPassword'))
    );
  }

  private setSession(authResult: HttpResponse<any>): void {
    const expiresAt = new Date(authResult.body.expiration * 1000);
    localStorage.setItem('token', authResult.body.token);
    localStorage.setItem('expiration', expiresAt.toISOString());
    const role = authResult.body.roles ? authResult.body.roles[0].description : '';
    localStorage.setItem('role', JSON.stringify(role));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('role');
  }

  public isLoggedIn(): boolean {
    return isBefore(new Date(), this.getExpiration());
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  getExpiration(): Date {
    const expiration = localStorage.getItem('expiration');
    return expiration ? parseISO(expiration) : new Date(0);
  }

  getRoles(): string {
    const role = localStorage.getItem('role');
    return role ? JSON.parse(role) : '';
  }

  isAdmin(): boolean {
    return this.getRoles() === 'Administrador';
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
