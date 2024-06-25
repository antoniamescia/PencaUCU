import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ScoreboardService {
  // private url = 'http://nicolascartalla.duckdns.org:65180/api/v1';
  private url = "http://localhost:8080/api/v1";

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(private http: HttpClient) {}

  getScoreboardByChampionshipId(): any {
    const championship_id = 1;
    return this.http.post<any>(`${this.url}/positiontable`, {championship_id: championship_id});
  }
}
