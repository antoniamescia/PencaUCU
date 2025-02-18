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
import { TooltipPosition } from "@angular/material/tooltip";
import { FormControl } from "@angular/forms";

import * as moment from 'moment-timezone';

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
  predictionExists: boolean = false; // Flag to check if prediction exists
  prediction?: Prediction;
  predictionIsNull: boolean = false;
  @Input() key: number = 0;
  positionOptions: TooltipPosition[] = [
    "after",
    "before",
    "above",
    "below",
    "left",
    "right",
  ];
  position = new FormControl(this.positionOptions[0]);

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
    
    if (this.match && this.match.match_date) {
      console.log('Match Date before formatting:', this.match.match_date);
      
      const matchDate = moment.tz(this.match.match_date, "UTC");
    // Retrieve current date in Montevideo and convert to UTC for display
    const currentDate = moment().tz("America/Montevideo").utc();

    console.log('Match Date in UTC:', matchDate.format("YYYY-MM-DDTHH:mm:ss[Z]")); // Formats to ISO with 'Z'
    console.log('Current Date in UTC:', currentDate.format("YYYY-MM-DDTHH:mm:ss[Z]")); // Formats to ISO with 'Z'

    const oneHourBefore = matchDate.clone().subtract(1, 'hour').format("YYYY-MM-DDTHH:mm:ss[Z]");
    const oneMinuteBefore = matchDate.clone().subtract(1, 'minute').format("YYYY-MM-DDTHH:mm:ss[Z]");

    console.log('One Hour Before:', oneHourBefore);
    console.log('One Minute Before:', oneMinuteBefore);

    if (currentDate.isBetween(moment(oneHourBefore, "YYYY-MM-DDTHH:mm:ss[Z]"), moment(oneMinuteBefore, "YYYY-MM-DDTHH:mm:ss[Z]"), null, '[]')) {
      console.log("Match is about to start");
      return "Por comenzar";
    }
    }
    // Use the status if it's set directly (ideal if your backend or loading logic sets this)
    if (this.match?.status) {
      switch (this.match.status) {
        case "inProgress":
          return "En curso";
        case "finished":
          return "Finalizado";
        case "upcoming":
          return "Próximo";
      }
    }

    // Fallback to calculating based on date if no status is set
    if (!this.match || !this.match.match_date) {
      return "";
    }

    const matchDate = new Date(this.match.match_date);
    const currentDate = new Date();

    if (matchDate > currentDate) {
      return "Próximo";
    } else if (matchDate < currentDate) {
      return "Finalizado";
    }

    // Assume any match occurring today without explicit status is in progress
    return "En curso";
  }

  addPrediction(): void {
    if (this.match && this.team1 && this.team2) {
      const dialogRef = this.dialog.open(PredictionComponent, {
        width: "600px", // Set a specific width or use 'auto' if content varies significantly
        maxWidth: "95vw", // Adjust if necessary to prevent overflow
        maxHeight: "90vh", // Optional: limits the height of the dialog
        data: {
          team1: this.team1,
          team2: this.team2,
          matchDate: this.match?.match_date,
          matchId: this.match?.match_id,
          prediction: this.prediction,
        },
      });
    }
  }

  getPrediction(): void {
    this.predictionService
      .getPredictionByUserIdAndChampionshipId()
      .subscribe((predictions: Prediction[]) => {
        this.predictionExists = predictions.some((pred: Prediction) => {
          return pred.match_id === this.match?.match_id;
        });

        this.prediction = predictions.find((pred: Prediction) => {
          const matchFound = pred.match_id === this.match?.match_id;
          return matchFound;
        });

        // Now set predictionIsNull here after prediction has potentially been set
        this.predictionIsNull =
          !this.prediction ||
          this.prediction.goals_local === null ||
          this.prediction.goals_visitor === null;
      });
  }

  calculatePoints(): number {
    // Check if necessary data is missing or incomplete
    if (
      !this.match ||
      !this.prediction ||
      this.prediction.goals_local === null ||
      this.prediction.goals_visitor === null ||
      this.match.goals_local === null ||
      this.match.goals_visitor === null
    ) {
      return 0;
    }

    // Exact result match
    if (
      this.match.goals_local === this.prediction.goals_local &&
      this.match.goals_visitor === this.prediction.goals_visitor
    ) {
      return 4;
    }

    // Correct winner or draw prediction
    const matchDifference = this.match.goals_local - this.match.goals_visitor;
    const predictionDifference =
      this.prediction.goals_local - this.prediction.goals_visitor;

    if (
      (matchDifference > 0 && predictionDifference > 0) || // Both predict home win
      (matchDifference < 0 && predictionDifference < 0) || // Both predict away win
      (matchDifference === 0 && predictionDifference === 0)
    ) {
      // Both predict a draw
      return 2;
    }

    return 0; // Incorrect prediction
  }

  reloadComponent() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
