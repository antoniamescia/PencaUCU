import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit {
  team1Score: number | null = null;
  team2Score: number | null = null;
  applyToAllGroups = false;

  constructor(
    public dialogRef: MatDialogRef<PredictionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  incrementScore(team: 'team1' | 'team2'): void {
    if (team === 'team1') {
      this.team1Score = (this.team1Score || 0) + 1;
    } else {
      this.team2Score = (this.team2Score || 0) + 1;
    }
  }

  decrementScore(team: 'team1' | 'team2'): void {
    if (team === 'team1') {
      if (this.team1Score !== null && this.team1Score > 0) {
        this.team1Score--;
      }
    } else if (team === 'team2') {
      if (this.team2Score !== null && this.team2Score > 0) {
        this.team2Score--;
      }
    }
  }

  savePrediction(): void {
    // Save logic here, possibly send data to the server
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
