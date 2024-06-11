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
    if (email === 'admin@admin.com' && password === 'admin') {
      console.log('Dummy login successful');
      const dummyResponse = {
        body: {
          token: 'dummy-token',
          expiration: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
          roles: [{ description: 'Admin' }]
        },
        status: 200,
        statusText: 'OK',
        headers: null,
        url: null,
        ok: true,
        type: 4,
        clone: () => null
      } as unknown as HttpResponse<any>;

      return of(dummyResponse).pipe(
        tap(res => this.setSession(res)),
        shareReplay()
      );
    } else {
      console.log('Dummy login failed');
      const dummyErrorResponse = {
        body: {
          error: 'Invalid email or password'
        },
        status: 401,
        statusText: 'Unauthorized',
        headers: null,
        url: null,
        ok: false,
        type: 4,
        clone: () => null
      } as unknown as HttpResponse<any>;

      return of(dummyErrorResponse);
    }

    // return this.http.post<any>(`${this.url}authenticate`, { email, password }, { ...this.httpOptions, observe: 'response' }).pipe(
    //   tap(res => this.setSession(res)),
    //   shareReplay(),
    //   catchError(this.handleError<any>('login'))
    // );
  }

  private setSession(authResult: any) {
    const expiresAt = new Date(authResult.body.expiration * 1000);

    localStorage.setItem('token', authResult.body.token);
    localStorage.setItem('expiration', JSON.stringify(expiresAt.valueOf()));

    if (authResult.body.roles == null) {
      localStorage.setItem('role', JSON.stringify(''));
      return;
    }

    localStorage.setItem('role', JSON.stringify(authResult.body.roles[0].description));
  }

  signUp(user: any): Observable<HttpResponse<any>> {
    console.log(user);
    
    console.log('Dummy signup successful');
    

    return this.http.post<any>(`${this.url}signup`, { user }, { ...this.httpOptions, observe: 'response' }).pipe(
      catchError(this.handleError<any>('signUp'))
    );
  }

  recoverPassword(email: string, question_id: number, answer: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.url}authenticate/recoverpwd`, { email, question_id, answer }, { ...this.httpOptions, observe: 'response' }).pipe(
      catchError(this.handleError<any>('recoverPassword'))
    );
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
