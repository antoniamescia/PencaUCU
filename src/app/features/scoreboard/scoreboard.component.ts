import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/core/services/auth.service';
import { ScoreboardService } from 'src/app/core/services/scoreboard.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent {

  displayedColumns: string[] = ['position', 'name', 'points'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  isAdmin: boolean = false;

  constructor(
    private http: HttpClient,
    private scoreboardService: ScoreboardService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.getScoreboard();
    
    
  }

  getScoreboard() {
    this.scoreboardService.getScoreboardByChampionshipId().subscribe({
      next: (players: any[]) => {
        players.sort((a, b) => b.points - a.points); // Sort by points descending
        players.forEach((player, index) => {
          player.position = index + 1; // Assigning the position based on sorting
        });
        this.dataSource = new MatTableDataSource(players);
        this.dataSource.sort = this.sort;
      },
      error: (error: any) => {
        console.error("Error fetching scoreboard:", error);
      }
    });
  }

  getMedalImage(index: number): string {
    if (index === 0) return 'path/to/gold-medal.png';
    if (index === 1) return 'path/to/silver-medal.png';
    if (index === 2) return 'path/to/bronze-medal.png';
    return ''; 
  }

  
}
