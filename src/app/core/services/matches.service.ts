import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {

  // private url = 'http://nicolascartalla.duckdns.org:65180/api/v1';
  private url = 'http://localhost:8080/api/v1'

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  // Get matches that have not been played yet by championship ID
  getNotPlayedMatchesByChampionshipID(): Observable<any> {
    return this.http.get(`${this.url}/match/notplayed/1`, this.httpOptions);
  }

  // Get matches that have been played by championship ID
  getPlayedMatchesByChampionshipID(): Observable<any> {
    return this.http.get(`${this.url}/match/played/1`, this.httpOptions);
  }

  getInProgressMatchesByChampionshipID(): Observable<any> {
    return this.http.get(`${this.url}/match/inprogress/1`, this.httpOptions);
  }

  // Get the result of a specific match by its ID
  getMatchResultByID(matchId: number): Observable<any> {
    return this.http.get(`${this.url}/match/played/id/${matchId}`, this.httpOptions);
  }
}
