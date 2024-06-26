import { HttpClient } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Match } from "src/app/core/models/match";
import { Team } from "src/app/core/models/team";
import { TeamsService } from "src/app/core/services/teams.service";
import { DeleteMatchModalComponent } from "../delete-match-modal/delete-match-modal.component";
import { MatDialog } from "@angular/material/dialog";
import { EnterResultsModalComponent } from "../enter-results-modal/enter-results-modal.component";
import { EditMatchModalComponent } from "../edit-match-modal/edit-match-modal.component";

@Component({
  selector: "app-admin-match-card",
  templateUrl: "./admin-match-card.component.html",
  styleUrls: ["./admin-match-card.component.css"],
})
export class AdminMatchCardComponent {
  @Input() match?: Match;
  matchStatus?: string;
  team1?: Team;
  team2?: Team;
  match_date = this.match?.match_date.toDateString();

  constructor(
    private router: Router,
    private http: HttpClient,
    private teamsService: TeamsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.match) {
      this.getTeams(this.match.team_local_id, this.match.team_visitor_id);
      this.matchStatus = this.getMatchStatusText();
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
      return (
        date1.getHours() > date2.getHours() ||
        (date1.getHours() === date2.getHours() &&
          date1.getMinutes() >= date2.getMinutes())
      );
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

  editMatch() {
    const dialogRef = this.dialog.open(EditMatchModalComponent, {
      width: "800px",
      height: "auto",
      data: { 
        match: this.match,
        team1: this.team1,
        team2: this.team2,
        enter: true
      },
    });


  }

  deleteMatch() {
    console.log("Delete match INFO", this.match);
    
    const dialogRef = this.dialog.open(DeleteMatchModalComponent, {
      width: "400px",
      height: "auto",
      data: { match: this.match },
    });

  }

  enterMatchResults() {
    const dialogRef = this.dialog.open(EnterResultsModalComponent, {
      width: "400px",
      height: "auto",
      data: { 
        match: this.match,
        team1: this.team1,
        team2: this.team2,
        enter: true
      },
    });

  }

  editResults() {
    const dialogRef = this.dialog.open(EnterResultsModalComponent, {
      width: "400px",
      height: "auto",
      data: { 
        match: this.match,
        team1: this.team1,
        team2: this.team2,
        edit: true
      },
    });

  }

  reloadComponent() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


}
