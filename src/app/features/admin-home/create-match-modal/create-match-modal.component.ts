import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

import { formatISO, setHours, setMinutes } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import { Team } from "src/app/core/models/team";
import { AdminService } from "src/app/core/services/admin.service";
import { TeamsService } from "src/app/core/services/teams.service";

@Component({
  selector: "app-create-match-modal",
  templateUrl: "./create-match-modal.component.html",
  styleUrls: ["./create-match-modal.component.css"],
})
export class CreateMatchModalComponent {
  createMatchForm!: FormGroup;
  teams: Team[] = [];
  stages = [
    { id: 1, name: "Fase de Grupos" },
    { id: 2, name: "Cuartos de Final" },
    { id: 3, name: "Semifinal" },
    { id: 4, name: "Final" },
  ];
  groups = [
    { id: 1, name: "Grupo A" },
    { id: 2, name: "Grupo B" },
    { id: 3, name: "Grupo C" },
    { id: 4, name: "Grupo D" },
  ];
  times: string[] = [];

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private adminService: AdminService,
    private teamsService: TeamsService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getTeams();
    this.generateTimeOptions();
    this.createMatchForm = this.fb.group({
      localTeam: [null, Validators.required],
      visitorTeam: [null, Validators.required],
      matchDate: [null, Validators.required],
      matchTime: [null, Validators.required],
      stage: [null, Validators.required],
      group: [null],
      goals_local: [null, Validators.required],
      goals_visitor: [null, Validators.required],
    });
  }

  getTeams() {
    this.teamsService.getTeamsByChampionshipId().subscribe({
      next: (response) => {
        this.teams = response;
        console.log("Teams loaded:", response);
      },
      error: (err) => {
        console.error("Failed to load teams:", err);
      },
    });
  }

  insertMatch() {
    const formData = this.createMatchForm?.value;
    console.log('Form Data:', formData);
    const formattedDateTime = this.formatDateTime(
      formData.matchDate,
      formData.matchTime
    );

    const match = {
      localTeam: formData.localTeam,
      visitorTeam: formData.visitorTeam,
      stage: formData.stage,
      group: formData.group,
      matchDate: formattedDateTime, // replace the original date with the formatted one
    };

    this.adminService.insertMatch(match).subscribe({
      next: (response) => {
        console.log("Match inserted:", response);
        this.dialog.closeAll();
        this.snackbar.open("Partido creado correctamente!", "Cerrar", {
          duration: 3000,
          panelClass: ["snackbar-success"],
     });
      },
      error: (err) => {
        console.error("Failed to insert match:", err);
        this.snackbar.open("Error al crear el partido", "Cerrar", {
          duration: 3000,
          panelClass: ["snackbar-success"],
     });
      },
    });
  }

  generateTimeOptions() {
    this.times = [];
    const startTime = 0; // start at 0:00
    const endTime = 23; // end at 23:00

    for (let hour = startTime; hour <= endTime; hour++) {
      let time = `${hour.toString().padStart(2, "0")}:00`;
      this.times.push(time);
    }
  }

  
  formatDateTime(date: Date, time: string): string {
    const dateObj = new Date(date);
    const [hours, minutes] = time.split(":").map(Number);
    dateObj.setHours(hours, minutes, 0, 0); // También se puede poner los milisegundos a 0 si es necesario
  
    // Formateo manual para mantener la zona horaria local
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;  // Meses en JavaScript son 0-indexados
    const day = dateObj.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
    // Concatena la fecha con la hora
    return `${formattedDate}T${formattedTime}:00.000Z`;  // Asegúrate de que la estructura final coincide con lo que el servidor espera
  }
  

}
