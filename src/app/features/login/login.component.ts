import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = true;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  login() {
    if (this.loginForm.valid) {
      this.submitted = true;

      //Sanitize email and password
      const email = this.loginForm.value.email.trim();
      const password = this.loginForm.value.password.trim();

      this.authService.login(email, password).subscribe(
        (res) => {
          console.log("RESPONSEE", res);
          if (res.status === 200) {
            this.snackBar.open("Bienvenido!", "Cerrar", {
              duration: 3000,
              panelClass: ["snackbar-success"],
            });            
            this.router.navigate(["/partidos"]);
          } else {
            this.snackBar.open("Error al iniciar sesión", "Cerrar", {
              duration: 3000,
              panelClass: ["snackbar-error"],
            });
            this.submitted = false;
          }
        }
      );
    }
  }
}
