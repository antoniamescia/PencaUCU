import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  expanded = true;
  user = {
    name: 'John',
    lastName: 'Doe',
    avatar: 'path/to/avatar.png' // Make sure this path is correct
  };
new: Date|undefined;

  constructor(private router: Router) {}

  matches = [
    {
      match_id: 1,
      date: new Date(),
      team1_id: 1,
      team2_id: 2,
      championship_id: 1
    },
    {
      match_id: 2,
      date: new Date(),
      team1_id: 3,
      team2_id: 4,
      championship_id: 1
    }
  ];

  toggleSidenav() {
    this.expanded = !this.expanded;
  }

  logout() {
    // Implement logout logic here
    console.log('Logout clicked');
  }

  onOutletLoaded(event: any) {
    // Handle outlet loaded event if necessary
  }
}
