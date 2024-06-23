import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Team } from "src/app/core/models/team";
import { ChampionPredictionService } from "src/app/core/services/champion-prediction.service";
import { TeamsService } from "src/app/core/services/teams.service";

@Component({
  selector: "app-predictionmodal",
  templateUrl: "./predictionmodal.component.html",
  styleUrls: ["./predictionmodal.component.css"],
})
export class PredictionModalComponent implements OnInit {
  predictionForm: FormGroup;
  teams: Team[] = []; // This should be filled with data from your API

  constructor(
    public dialogRef: MatDialogRef<PredictionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private teamsService: TeamsService,
    private championshipPredictionService: ChampionPredictionService
  ) {
    this.predictionForm = this.fb.group({
      champion: [null, Validators.required],
      subChampion: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.predictionForm = this.fb.group(
      {
        champion: [null, Validators.required],
        subChampion: [null, Validators.required],
      },
      { validator: this.differentTeamsValidator }
    );

    // Fetch teams
    this.getTeams();
  }
  getTeams() {
    this.teamsService.getTeamsByChampionshipId().subscribe({
      next: (response) => {
        this.teams = response; // Assuming the response is an array of teams
        console.log("Teams loaded:", this.teams);
      },
      error: (err) => {
        console.error("Failed to load teams:", err);
      },
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  differentTeamsValidator: Validators = (formGroup: FormGroup) => {
    const champion = formGroup.get("champion")?.value;
    const subChampion = formGroup.get("subChampion")?.value;
    return champion && subChampion && champion === subChampion
      ? { sameTeamError: true }
      : null;
  };

  selectedChampion: any = null;
  selectedSubChampion: any = null;

  onSelectTeam(team: any, type: "champion" | "subChampion") {
    if (type === "champion") {
      this.selectedChampion = team;
    } else {
      this.selectedSubChampion = team;
    }
  }

  postChampionsPrediction() {
    if (this.predictionForm.valid) {
      const championId = this.predictionForm.get("champion")?.value;
      const subChampionId = this.predictionForm.get("subChampion")?.value;

      console.log("Champion ID:", championId);
      console.log("Sub-champion ID:", subChampionId);

      const predictionData = {
        champion: championId,
        subChampion: subChampionId,
      };

      this.championshipPredictionService
        .insertOrUpdatePredictionChampions(predictionData)
        .subscribe({
          next: (response) => {
            console.log("Prediction saved successfully", response);
            // Reload window
            window.location.reload();
          },
          error: (error) => {
            console.error("Failed to save prediction", error);
          },
        });
    } else {
      console.error("Form is invalid");
    }
    window.location.reload();
  }
}
