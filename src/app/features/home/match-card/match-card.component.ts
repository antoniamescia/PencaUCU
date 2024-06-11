import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

import { Match } from "src/app/core/models/match";
import { Team } from "src/app/core/models/team";
import { PredictionComponent } from "../../prediction/prediction.component";

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: "app-match-card",
  templateUrl: "./match-card.component.html",
  styleUrls: ["./match-card.component.css"],
})
export class MatchCardComponent {
  @Input() match?: Match;

  @Input() matchStatus = "";
  @Input() team1?: Team;
  @Input() team2?: Team;
  @Input() team1Score = this.match?.goals_local;
  @Input() team2Score = this.match?.goals_visitor;
  @Input() matchDate = this.match?.date.toDateString();

  constructor(private router: Router) {}

  getMatches() {
    // Implement the logic to get the matches
    // DUMMY MOCK
    return [
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
  }

  getTeam(team1_id: number, team2_id: number) {
    // Implement the logic to get the teams
    // DUMMY MOCK
    return [
      {
        team_id: 1,
        name: "Team 1",
        logo: "path/to/team1.png",
      },
      {
        team_id: 2,
        name: "Team 2",
        logo: "path/to/team2.png",
      },
    ];
  }

  getMatchStatusText(): string {
    if (!this.match || !this.match.date) {
      return "";
    }
    const matchDate = new Date(this.match.date);
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

//   addPrediction(): void {
//     if (this.match && this.team1 && this.team2 && this.matchDate) {
//       const dialogRef = this.dialog.open(PredictionComponent, {
//         width: '400px',
//         data: {
//           team1: this.team1,
//           team2: this.team2,
//           matchDate: this.matchDate,
//         }
//       });

//       dialogRef.afterClosed().subscribe(result => {
//         console.log('The dialog was closed');
//       });
//     }
// } 
}
