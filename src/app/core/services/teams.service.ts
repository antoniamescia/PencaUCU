import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  // private url = 'http://nicolascartalla.duckdns.org:65180/api/v1';
  private url = 'http://localhost:8080/api/v1'

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  getTeamsByChampionshipId(championshipId: number = 1): Observable<any> {
    
    return this.http.get<any>(`${this.url}/team/championship/${championshipId}`);
  }

  getTeamById(teamId: number): Observable<any> {
    return this.http.get<any>(`${this.url}/team/${teamId}`);
  }
}
