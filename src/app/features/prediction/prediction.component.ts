import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";

import { PredictionService } from "src/app/core/services/prediction.service";

@Component({
  selector: "app-prediction",
  templateUrl: "./prediction.component.html",
  styleUrls: ["./prediction.component.css"],
})
export class PredictionComponent implements OnInit {
  team1Score: number = this.data.prediction?.goals_local || 0;
  team2Score: number = this.data.prediction?.goals_visitor || 0;

  constructor(
    public dialogRef: MatDialogRef<PredictionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private predictionService: PredictionService,
    private snackbar: MatSnackBar,
    private router:  Router
  ) {}

  ngOnInit(): void {
    throw new Error("Method not implemented.");
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

  savePrediction(): void {
    console.log("Saving prediction");
    console.log(this.team1Score, this.team2Score);

    if (this.team1Score !== null && this.team2Score !== null) {
      const matchId = this.data.matchId;
      console.log("Match ID:", matchId);

      // Prepare the data object to send
      const predictionData = {
        match_id: matchId,
        goals_local: this.team1Score,
        goals_visitor: this.team2Score,
      };

      this.predictionService.insertPrediction(predictionData).subscribe({
        next: (response) => {
          this.dialogRef.close(true); // Close the dialog and indicate success
          this.snackbar.open("Predicción guardada correctamente", "Cerrar", {
            duration: 3000,
            panelClass: ["snackbar-success"],
          });
        },
        error: (error) => {
          this.dialogRef.close(false); // Close the dialog and indicate failure
          this.snackbar.open("Error al guardar predicción", "Cerrar", {
            duration: 3000,
            panelClass: ["snackbar-success"],
          });
        },
      });
    } else {
      console.error("Both scores must be set to save the prediction.");
    }
    this.reloadComponent()
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  reloadComponent() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
