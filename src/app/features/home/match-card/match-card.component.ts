import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Match } from "src/app/core/models/match";
import { Team } from "src/app/core/models/team";
import { PredictionComponent } from "../../prediction/prediction.component";

import { MatDialog } from "@angular/material/dialog";
import { TeamsService } from "src/app/core/services/teams.service";
import { HttpClient } from "@angular/common/http";
import { PredictionService } from "src/app/core/services/prediction.service";
import { Prediction } from "src/app/core/models/prediction";

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
  prediction?: Prediction;
  @Input() key: number = 0;


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
      },
      error: (error) => {
        console.error("Error fetching team1:", error);
      },
    });

    this.teamsService.getTeamById(team2_id).subscribe({
      next: (team) => {
        this.team2 = team;
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
  
    const isTimeEqualOrLater = (date1: Date, date2: Date): boolean => {
      return date1.getHours() > date2.getHours() ||
             (date1.getHours() === date2.getHours() && date1.getMinutes() >= date2.getMinutes());
    };
  
    if (isSameDay(matchDate, currentDate)) {
      if (isTimeEqualOrLater(currentDate, matchDate)) {
        return "En curso";
      }
      return "Próximo"; // Si es el mismo día pero la hora del partido aún no ha llegado.
    } else if (matchDate.getTime() < currentDate.getTime()) {
      return "Finalizado"; // El partido ya ocurrió en una fecha anterior.
    } else {
      return "Próximo"; // Fecha del partido aún no ha llegado.
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
    //refresh tab
    
  }

  refreschMatchCard(): void {
    this.key++;
  }

  getPrediction(): void {
    this.predictionService.getPredictionByUserIdAndChampionshipId().subscribe((predictions: Prediction[]) => {
      
      this.predictionExists = predictions.some((pred: Prediction) => {
        return pred.match_id === this.match?.match_id;
      });

      this.prediction = predictions.find((pred: Prediction) => {
        const matchFound = pred.match_id === this.match?.match_id;
        if (matchFound) {
          console.log("Match found for ID:", pred.match_id); // Log when a match is found
        }
        return matchFound;
      });

    });
  }



}
