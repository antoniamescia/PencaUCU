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
