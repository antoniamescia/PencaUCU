import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-admin-sidenav',
  templateUrl: './admin-sidenav.component.html',
  styleUrls: ['./admin-sidenav.component.css']
})
export class AdminSidenavComponent {

  expanded = true;

  constructor(private router: Router, private authService: AuthService) {}

  toggleSidenav() {
    this.expanded = !this.expanded;
  }

  logout() {
    this.authService.logout();
    
    this.router.navigate(['/']);
  }

  onOutletLoaded(event: any) {
    // Handle outlet loaded event if necessary
  }
}
