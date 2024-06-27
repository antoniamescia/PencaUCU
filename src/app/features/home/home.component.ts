import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ChampionPredictionService } from "src/app/core/services/champion-prediction.service";
import { PredictionModalComponent } from "./predictionmodal/predictionmodal.component";
import { Match } from "src/app/core/models/match";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  expanded = true;
  new: Date | undefined;
  notPlayedMatches: Match[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private championshipPredictionService: ChampionPredictionService,
  ) {}

  ngOnInit() {
    this.loadPredictions();
  }

  matches = [
    {
      match_id: 1,
      date: new Date(),
      team1_id: 1,
      team2_id: 2,
      championship_id: 1,
    },
    {
      match_id: 2,
      date: new Date(),
      team1_id: 3,
      team2_id: 4,
      championship_id: 1,
    },
  ];

  toggleSidenav() {
    this.expanded = !this.expanded;
  }

  logout() {
    // Implement logout logic here
  }

  onOutletLoaded(event: any) {
    // Handle outlet loaded event if necessary
  }

  loadPredictions() {
    this.championshipPredictionService
      .getPredictionChampionsByUserId()
      .subscribe({
        next: (response) => {
          if (!response) {
            this.openPredictionModal();
          } 
        },
        error: (err) => {
          console.error("Error fetching predictions:", err);
          this.openPredictionModal();
        },
      });
  }

  openPredictionModal() {
    this.dialog.open(PredictionModalComponent, {
      width: '400px',
      data: { name: 'yourData' } // Pass any required data
    });
  }

 
}
