import { Component, OnInit } from '@angular/core';
import { Match } from '../../../core/models/match';
import { MatchesService } from 'src/app/core/services/matches.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-match-tabs',
  templateUrl: './match-tabs.component.html',
  styleUrls: ['./match-tabs.component.css']
})
export class MatchTabsComponent implements OnInit {
  matches: Match[] = [];
  upcomingMatches: Match[] = [];
  finishedMatches: Match[] = [];

  constructor(private matchesService: MatchesService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadNotPlayedMatches();
    this.loadPlayedMatches();
  }


  loadNotPlayedMatches() {
    this.matchesService.getNotPlayedMatchesByChampionshipID().subscribe({
      next: (matches) => {
        console.log("Not played matches:", matches);
        this.upcomingMatches = matches; // Assign the matches to the component property
      },
      error: (error) => {
        console.error("Error fetching not played matches:", error);
      }
    });
  }

  loadPlayedMatches() {
    this.matchesService.getPlayedMatchesByChampionshipID().subscribe({
      next: (matches) => {
        console.log("Played matches:", matches);
        this.finishedMatches = matches; // Assign the matches to the component property
      },
      error: (error) => {
        console.error("Error fetching played matches:", error);
      }
    });
  }
}

