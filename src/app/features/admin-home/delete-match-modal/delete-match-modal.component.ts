import { HttpBackend, HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
    @Inject(MAT_DIALOG_DATA) public data: any // Inject data passed to the dialog
  ) {}

  ngOnInit(): void {
    console.log("DATA REACHING THE MODAL",this.data);}

  deleteMatch(): void {    
    this.adminService.deleteMatch(this.data.match.match_id).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (err) => {
        this.dialogRef.close(null);
      }
    });
  }

  

}
