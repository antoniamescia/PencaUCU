import { Component, OnInit } from '@angular/core';
// import { MatchService } from '../services/match.service';
import { Match } from '../../../core/models/match';

@Component({
  selector: 'app-match-tabs',
  templateUrl: './match-tabs.component.html',
  styleUrls: ['./match-tabs.component.css']
})
export class MatchTabsComponent implements OnInit {
  matches: Match[] = [];
  upcomingMatches: Match[] = [];
  finishedMatches: Match[] = [];

  // constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    // this.matches = this.matchService.getMatches();

    this.matches = this.getMatches();
    const now = new Date();
    this.upcomingMatches = this.matches.filter(match => new Date(match.date) > now);
    this.finishedMatches = this.matches.filter(match => new Date(match.date) <= now);
  }

  getMatches(): Match[] {
    // Implement the logic to get the matches
    // DUMMY MOCK
    return [
      {
        match_id: 1,
        date: new Date(),
        team_local_id: 1,
        team_visitor_id: 2,
        goals_local: 2,
        goals_visitor: 1,
        championship_id: 1
      },
      {
        match_id: 2,
        date: new Date(),
        team_local_id: 3,
        team_visitor_id: 4,
        goals_local: 1,
        goals_visitor: 1,
        championship_id: 1
      }
    ];
  }
}

