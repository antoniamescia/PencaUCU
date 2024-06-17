import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Match } from "src/app/core/models/match";
import { Team } from "src/app/core/models/team";
import { PredictionComponent } from "../../prediction/prediction.component";

import { MatDialog } from "@angular/material/dialog";
import { TeamsService } from "src/app/core/services/teams.service";
import { HttpClient } from "@angular/common/http";
import { PredictionService } from "src/app/core/services/prediction.service";

@Component({
  selector: "app-match-card",
  templateUrl: "./match-card.component.html",
  styleUrls: ["./match-card.component.css"],
})
export class MatchCardComponent implements OnInit {
  @Input() match?: Match;
  matchStatus?: string;
  team1?: Team;
  team2?: Team;
  match_date = this.match?.match_date.toDateString();
  predictionExists: boolean = false;  // Flag to check if prediction exists


  constructor(
    private router: Router,
    private http: HttpClient,
    private teamsService: TeamsService,
    private predictionService: PredictionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.match) {
      this.getTeams(this.match.team_local_id, this.match.team_visitor_id);
      this.matchStatus = this.getMatchStatusText();
      this.getPrediction();
    }
  }

  getTeams(team1_id: number, team2_id: number) {
    this.teamsService.getTeamById(team1_id).subscribe({
      next: (team) => {
        this.team1 = team;
        console.log("team1", this.team1);
      },
      error: (error) => {
        console.error("Error fetching team1:", error);
      },
    });

    this.teamsService.getTeamById(team2_id).subscribe({
      next: (team) => {
        this.team2 = team;
        console.log("team2", this.team2);
      },
      error: (error) => {
        console.error("Error fetching team2:", error);
      },
    });
  }

  getMatchStatusText(): string {
    if (!this.match || !this.match.match_date) {
      return "";
    }
    const matchDate = new Date(this.match.match_date);
    const currentDate = new Date();

    const isSameDay = (date1: Date, date2: Date): boolean => {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    };

    if (
      matchDate.getTime() < currentDate.getTime() &&
      !isSameDay(matchDate, currentDate)
    ) {
      return "Finalizado";
    } else if (isSameDay(matchDate, currentDate)) {
      return "En curso";
    } else {
      return "Próximo";
    }
  }

  addPrediction(): void {    
    if (this.match && this.team1 && this.team2) {
      const dialogRef = this.dialog.open(PredictionComponent, {
        width: '600px', // Set a specific width or use 'auto' if content varies significantly
        maxWidth: '95vw', // Adjust if necessary to prevent overflow
        maxHeight: '90vh', // Optional: limits the height of the dialog
        data: {
          team1: this.team1,
          team2: this.team2,
          matchDate: this.match?.match_date,
          matchId: this.match?.match_id,
        }
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed", result);
      });
    }
  }

  getPrediction(): void {
    this.predictionService.getPredictionByUserIdAndChampionshipId().subscribe(predictions => {
      // Check if there's a prediction for the current match
      this.predictionExists = predictions.some((pred: { match_id: number | undefined; }) => pred.match_id === this.match?.match_id);
    });

    console.log("Prediction exists:", this.predictionExists);
    
  }
}
