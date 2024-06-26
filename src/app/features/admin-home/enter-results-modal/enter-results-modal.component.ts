import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AdminService } from "src/app/core/services/admin.service";

@Component({
  selector: "app-enter-results-modal",
  templateUrl: "./enter-results-modal.component.html",
  styleUrls: ["./enter-results-modal.component.css"],
})
export class EnterResultsModalComponent {
  team1Score: number | null = null;
  team2Score: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<EnterResultsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService: AdminService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  incrementScore(team: "team1" | "team2"): void {
    if (team === "team1") {
      this.team1Score = (this.team1Score || 0) + 1;
    } else {
      this.team2Score = (this.team2Score || 0) + 1;
    }
  }

  decrementScore(team: "team1" | "team2"): void {
    if (team === "team1") {
      if (this.team1Score !== null && this.team1Score > 0) {
        this.team1Score--;
      }
    } else if (team === "team2") {
      if (this.team2Score !== null && this.team2Score > 0) {
        this.team2Score--;
      }
    }
  }

  enterMatchResults() {
    console.log("Saving results");
    console.log(this.team1Score, this.team2Score);

    if (this.team1Score !== null && this.team2Score !== null) {
      const matchId = this.data.match.match_id;
      console.log("Match ID:", matchId);

      // Prepare the data object to send
      const resultsData = {
        match_id: matchId,
        goals_local: this.team1Score,
        goals_visitor: this.team2Score,
      };

      // Call the service to save the results
      this.adminService.insertMatchResult(resultsData).subscribe({
        next: (response) => {
          console.log("Match updated:", response);
          this.snackbar.open("Resultado actualizado exitosamente!", "Cerrar", {
            duration: 2000,
          });
          this.dialogRef.close(response);
        },
        error: (err) => {
          console.error("Error al actualizar resultado.", err);
          this.snackbar.open("Error al actualizar resultado.", "Cerrar", {
            duration: 2000,
          });
        },
      });
    }
    this.reloadComponent()
  }

  reloadComponent() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
