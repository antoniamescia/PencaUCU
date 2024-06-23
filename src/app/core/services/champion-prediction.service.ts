import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, Observable, of, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChampionPredictionService {

  // private url = 'http://nicolascartalla.duckdns.org:65180/api/v1';
  private url = 'http://localhost:8080/api/v1'

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getPredictionChampionsByUserId(): Observable<any> {
    let documentId = localStorage.getItem('document_id');

    // Assign a default value if document_id is not found in local storage
    if (!documentId) {
      documentId = '12345678'; // Default document ID
    }

    const body = {
      document_id: documentId,
      championship_id: 1  // Assuming championship_id is always 1
    };

    return this.http.post<any>(`${this.url}/prediction/championship`, body);
  }

  insertOrUpdatePredictionChampions(predictionData: any): Observable<HttpResponse<any>> {
    const documentId = localStorage.getItem('document_id');
    
    const requestBody = {
      document_id: documentId,  
      champion: predictionData.champion.team_id,
      subchampion: predictionData.subChampion.team_id,
      championship_id: 1  
    };

    console.log('Sending prediction data to backend:', requestBody);
    

    return this.http.post<HttpResponse<any>>(`${this.url}/prediction/championship/insert`, requestBody, { observe: 'response' });
  }
  
  
}
