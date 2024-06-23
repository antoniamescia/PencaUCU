import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "src/app/core/services/auth.service";
import { CreateMatchModalComponent } from "./create-match-modal/create-match-modal.component";

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
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    console.log("isAdmin", this.isAdmin);
  }

  openCreateMatchModal() {
    const dialogRef = this.dialog.open(CreateMatchModalComponent, {
      width: "800px", // Adjust width as needed
      height: "auto", // Adjust height as needed
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed", result);
      // Call service to create match if result is not null
    });
  }
}
