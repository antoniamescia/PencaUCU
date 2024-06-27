import { HttpBackend, HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin.service';

@Component({
  selector: 'app-delete-match-modal',
  templateUrl: './delete-match-modal.component.html',
  styleUrls: ['./delete-match-modal.component.css']
})
export class DeleteMatchModalComponent {

  constructor(
    private http: HttpClient,
    private adminService: AdminService,
    public dialogRef: MatDialogRef<DeleteMatchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}

  ngOnInit(): void {}

  deleteMatch(): void {    
    this.adminService.deleteMatch(this.data.match.match_id).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (err) => {
        this.dialogRef.close(null);
      }
    });
    this.reloadComponent();
  }

  reloadComponent() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  

}
