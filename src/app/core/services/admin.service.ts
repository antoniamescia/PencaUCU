import { group } from '@angular/animations';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  // private url = 'http://nicolascartalla.duckdns.org:65180/api/v1';
  private url = 'http://localhost:8080/api/v1'

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  insertMatch(matchData: any): Observable<HttpResponse<any>> {
    const url = `${this.url}/match/insert/`;
    const match = {
      team_local_id: matchData.localTeam,
      team_visitor_id: matchData.visitorTeam,
      match_date: matchData.matchDate,
      championship_id: 1,
      stage_id: matchData.stage,
      group_id: matchData.group
    }

    console.log('Sending match data to backend:', match);
    
    return this.http.post<any>(url, match, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response'
    });
  }

  updateMatch(matchData: any): Observable<HttpResponse<any>> {
    const url = `${this.url}/updateMatch`;
    return this.http.put<any>(url, matchData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response'
    });
  }

  deleteMatch(matchId: number): Observable<HttpResponse<any>> {
    console.log('Deleting match with ID:', matchId);
    
    const url = `${this.url}/match/delete`;
    return this.http.post<any>(url, { match_id: matchId }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response'
    });
  }

  insertMatchResult(resultData: any): Observable<HttpResponse<any>> {
    const url = `${this.url}/insertMatchResult`;
    return this.http.post<any>(url, resultData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response'
    });
  }
}
