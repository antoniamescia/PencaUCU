import { Component, Input, OnInit } from "@angular/core";
import { Match } from "../../../core/models/match";
import { MatchesService } from "src/app/core/services/matches.service";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "src/app/core/services/auth.service";
import { PredictionService } from "src/app/core/services/prediction.service";

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
    private authService: AuthService,
    private predictionService: PredictionService
  ) {}

  ngOnInit(): void {
    this.loadNotPlayedMatches();
    this.loadPlayedMatches();
  }

  updateMatchCards() {
    this.matchCardKey++; // Increment to refresh match cards
  }

  loadPlayedMatches() {
    this.matchesService.getPlayedMatchesByChampionshipID().subscribe({
      next: (matches) => {
        matches.forEach(
          (match: { status: string }) => (match.status = "finished")
        ); 
        this.finishedMatches = matches; 
        this.groupMatches(this.finishedMatches, "finished");
      },
      error: (error) => {
        console.error("Error fetching played matches:", error);
      },
    });
  }

  loadNotPlayedMatches() {
    this.matchesService.getNotPlayedMatchesByChampionshipID().subscribe({
      next: (upcomingMatches) => {
        if (Array.isArray(upcomingMatches)) {
          upcomingMatches.forEach(
            (match: { status: string }) => (match.status = "upcoming")
          );
        } 
        this.matchesService.getInProgressMatchesByChampionshipID().subscribe({
          next: (inProgressMatches) => {
            if (
              Array.isArray(inProgressMatches) &&
              inProgressMatches !== null
            ) {
              inProgressMatches.forEach(
                (match: { status: string }) => (match.status = "inProgress")
              );
            } 
            const combinedMatches = [
              ...(upcomingMatches || []), // Fallback to empty array if not an array
              ...(inProgressMatches || []), // Fallback to empty array if not an array
            ];
            this.upcomingMatches = combinedMatches; // Assign the combined matches to the component property
            this.groupMatches(combinedMatches, "upcoming");
          },
          error: (error) => {
            console.error("Error fetching in-progress matches:", error);
          },
        });
      },
      error: (error) => {
        console.error("Error fetching not played matches:", error);
      },
    });
  }

  groupMatches(matches: Match[], type: "upcoming" | "finished" | "inProgress") {
    const grouped: { [key: string]: Match[] } = matches.reduce(
      (groups: { [key: string]: Match[] }, match) => {
        // Ensure groupName is always a string even if properties are undefined
        const groupName = match.group_name
          ? `${match.group_name} | ${match.stage_name || "Unknown Stage"}`
          : match.stage_name || "Unknown Stage";
        if (!groups[groupName]) {
          groups[groupName] = [];
        }
        groups[groupName].push(match);
        return groups;
      },
      {}
    );

    if (type === "upcoming") {
      this.groupedUpcomingMatches = grouped;
    } else if (type === "finished") {
      this.groupedFinishedMatches = grouped;
    }
  }
}
