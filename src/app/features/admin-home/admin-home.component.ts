import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "src/app/core/services/auth.service";
import { CreateMatchModalComponent } from "./create-match-modal/create-match-modal.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin-home",
  templateUrl: "./admin-home.component.html",
  styleUrls: ["./admin-home.component.css"],
})
export class AdminHomeComponent {
  isAdmin: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
  }

  openCreateMatchModal() {
    const dialogRef = this.dialog.open(CreateMatchModalComponent, {
      width: "800px", // Adjust width as needed
      height: "auto", // Adjust height as needed
    });

  }

  reloadComponent() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
