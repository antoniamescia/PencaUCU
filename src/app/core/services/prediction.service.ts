import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  private url = 'http://nicolascartalla.duckdns.org:65180/api/v1';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  getPredictionByUserIdAndChampionshipId(): Observable<any> {
    const documentId = localStorage.getItem('document_id');
    const body = {
      document_id: documentId,
      championship_id: 1
    };

    return this.http.post<any>(`${this.url}/prediction/match`, body);
  }

  insertPrediction(predictionData: {
    match_id: number,
    goals_local: number,
    goals_visitor: number
  }): Observable<any> {
    const body = {
      document_id: localStorage.getItem('document_id'),
      match_id: predictionData.match_id,
      goals_local: predictionData.goals_local,
      goals_visitor: predictionData.goals_visitor
    };

    return this.http.post<any>(`${this.url}/prediction/match/insert`, body);
  }
}
