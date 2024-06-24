import { Component, Input, OnInit } from "@angular/core";
import { Match } from "../../../core/models/match";
import { MatchesService } from "src/app/core/services/matches.service";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-match-tabs",
  templateUrl: "./match-tabs.component.html",
  styleUrls: ["./match-tabs.component.css"],
})
export class MatchTabsComponent implements OnInit {
  matches: Match[] = [];
  upcomingMatches: Match[] = [];
  finishedMatches: Match[] = [];
  inProgressMatches: Match[] = [];
  groupedUpcomingMatches: { [key: string]: any } = {};
  groupedFinishedMatches: { [key: string]: any } = {};
  matchCardKey = 0;
  @Input() isAdmin?: boolean;

  constructor(
    private matchesService: MatchesService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadNotPlayedMatches();
    this.loadPlayedMatches();
    this.loadInProgressMatches();
  }

  updateMatchCards() {
    this.matchCardKey++; // Increment to refresh match cards
  }

  loadNotPlayedMatches() {
    this.matchesService.getNotPlayedMatchesByChampionshipID().subscribe({
      next: (matches) => {
        console.log("Not played matches:", matches);
        this.upcomingMatches = matches; // Assign the matches to the component property
        this.groupMatches(this.upcomingMatches, "upcoming");
      },
      error: (error) => {
        console.error("Error fetching not played matches:", error);
      },
    });
  }

  loadPlayedMatches() {
    this.matchesService.getPlayedMatchesByChampionshipID().subscribe({
      next: (matches) => {
        console.log("Played matches:", matches);
        this.finishedMatches = matches; // Assign the matches to the component property
        this.groupMatches(this.finishedMatches, "finished");
      },
      error: (error) => {
        console.error("Error fetching played matches:", error);
      },
    });
  }

  loadInProgressMatches() {
    this.matchesService.getInProgressMatchesByChampionshipID().subscribe({
      next: (matches) => {
        console.log("In progress matches:", matches);
        this.inProgressMatches = matches; // Assign the matches to the component property
      },
      error: (error) => {
        console.error("Error fetching in progress matches:", error);
      },
    });
  }

  groupMatches(matches: Match[], type: "upcoming" | "finished" | "inProgress") {
    const grouped: { [key: string]: Match[] } = matches.reduce(
      (groups: { [key: string]: Match[] }, match) => {
        // Ensure groupName is always a string even if properties are undefined
        const groupName = match.group_name ? `${match.group_name} | ${match.stage_name || 'Unknown Stage'}` : match.stage_name || 'Unknown Stage';
        if (!groups[groupName]) {
          groups[groupName] = [];
        }
        groups[groupName].push(match);
        return groups;
      },
      {}
    );
  
    // Assign grouped matches to the appropriate property based on the type
    if (type === "upcoming") {
      this.groupedUpcomingMatches = grouped;
    } else if (type === "finished") {
      this.groupedFinishedMatches = grouped;
    // } else {
    //   this.groupedInProgressMatches = grouped;  // Assuming there is a container for in-progress matches
    // }
  }
  
} 
}
