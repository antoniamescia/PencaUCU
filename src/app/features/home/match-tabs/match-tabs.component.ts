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
  groupedUpcomingMatches: { [key: string]: any } = {};  
  groupedFinishedMatches: { [key: string]: any } = {};  
  matchCardKey = 0;

  
  constructor(private matchesService: MatchesService, private http: HttpClient) {}
  
  ngOnInit(): void {
    this.loadNotPlayedMatches();
    this.loadPlayedMatches();
  }
  
  updateMatchCards() {
    this.matchCardKey++; // Increment to refresh match cards
  }

  loadNotPlayedMatches() {
    this.matchesService.getNotPlayedMatchesByChampionshipID().subscribe({
      next: (matches) => {
        console.log("Not played matches:", matches);
        this.upcomingMatches = matches; // Assign the matches to the component property
        this.groupMatches(this.upcomingMatches, 'upcoming');
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
        this.groupMatches(this.upcomingMatches, 'finished');
      },
      error: (error) => {
        console.error("Error fetching played matches:", error);
      }
    });
  }

  groupMatches(matches: Match[], type: 'upcoming' | 'finished') {
    const grouped: { [key: string]: Match[] } = matches.reduce((groups: { [key: string]: Match[] }, match) => {
      const groupName = `${match.group_name} | ${match.stage_name}`;
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(match);
      return groups;
    }, {});

    if (type === 'upcoming') {
      this.groupedUpcomingMatches = grouped;
    } else {
      this.groupedFinishedMatches = grouped;
    }
    console.log('Grouped matches:', grouped);
    console.log('Grouped upcoming matches:', this.groupedUpcomingMatches);
    console.log('Grouped finished matches:', this.groupedFinishedMatches);
    
    
  }
}

