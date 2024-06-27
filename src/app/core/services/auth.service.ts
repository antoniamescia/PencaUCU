import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, shareReplay, tap } from 'rxjs';
import { format, parseISO, isBefore } from 'date-fns';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private url = 'http://nicolascartalla.duckdns.org:65180';
  private url = 'http://localhost:8080'

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<HttpResponse<any>> {
    
    // Constructing the URL for the login API endpoint
    const loginUrl = `${this.url}/api/auth/signin`;

    return this.http.post<any>(loginUrl, { email, password }, { ...this.httpOptions, observe: 'response' })
      .pipe(
        tap(res => {
         // Assuming 'setSession' is your method to handle session setting
          this.setSession(res);
        }),
        shareReplay(),
        catchError(this.handleError<any>('login'))
      );
  }

  private setSession(authResult: any) { 

    if (authResult.body && authResult.body.user_profile) {
        // Parse the expiration time; assumes expiration is in ISO format
        const expiresAt = new Date(authResult.body.expiration).getTime();
        
        // Store authentication token and expiration in localStorage
        localStorage.setItem('id_token', authResult.body.token);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt));
    
        // Store user profile details in localStorage or a more appropriate place like a state management store
        localStorage.setItem('user_email', authResult.body.user_profile.email);
        localStorage.setItem('user_first_name', authResult.body.user_profile.first_name);
        localStorage.setItem('user_last_name', authResult.body.user_profile.last_name);
        localStorage.setItem('user_major', authResult.body.user_profile.major);
        localStorage.setItem('role_id', authResult.body.user_profile.role_id);
        localStorage.setItem('document_id', authResult.body.user_profile.document_id);
        
    } else {
        console.error('Invalid authentication result:', authResult);
    }
}

  

  // Sign Up
  signUp(user: User): Observable<HttpResponse<any>> { 
    const formattedUser = {
      email: user.email,
      document_id: user.document_id.replace('-', ''),
      password: user.password,
      first_name: user.first_name,
      last_name: user.last_name,
      major: user.major,
      role_id: 2 
    };

    const signupUrl = `${this.url}/api/auth/signup`;

    return this.http.post<any>(signupUrl, formattedUser, { ...this.httpOptions, observe: 'response' })
      .pipe(
        tap(response => {
         
        }),
        catchError(this.handleError<any>('signUp'))
      );
  }


  // TO-DO
  recoverPassword(email: string, question_id: number, answer: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.url}authenticate/recoverpwd`, { email, question_id, answer }, { ...this.httpOptions, observe: 'response' }).pipe(
      catchError(this.handleError<any>('recoverPassword'))
    );
  }

  logout(): void {
    localStorage.clear();

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
    const role = localStorage.getItem('role_id');
    return role === '1' ? 'Administrador' : 'Usuario';
  }

  isAdmin(): boolean {
    return this.getRoles() === 'Administrador';
  }

  redirectUser() {
    if (this.isAdmin()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/partidos']);  // Navigate to normal user home page
    }
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
