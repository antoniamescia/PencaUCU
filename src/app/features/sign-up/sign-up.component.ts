import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/services/auth.service";
import { emailDomainValidator } from "src/app/validators/email-domain.validator";
import { documentFormatValidator } from "src/app/validators/document.validator";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-signup",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"],
})
export class SignupComponent {
  signupForm: FormGroup;
  hide = true;
  submitted = false;
  filteredOptions: Observable<string[]>;

  majors: string[] = [
    "Abogacía",
    "Acompañamiento Terapéutico",
    "Agronomía",
    "Analista en Informática",
    "Arquitectura",
    "Artes Escénicas",
    "Artes Visuales",
    "Business Analytics",
    "Ciencia Política",
    "Cine",
    "Comunicación",
    "Comunicación y Marketing",
    "Contador Público",
    "Datos y Negocios",
    "Desarrollador de Software",
    "Dirección de Empresas",
    "Economía",
    "Educación Inicial",
    "Finanzas",
    "Fisioterapia",
    "Fonoaudiología",
    "Gestión Humana",
    "Ingeniería Ambiental",
    "Ingeniería en Alimentos",
    "Ingeniería en Electrónica",
    "Ingeniería en Informática",
    "Ingeniería Industrial",
    "Inteligencia Artificial y Ciencia de Datos",
    "Licenciatura en Enfermería",
    "Licenciatura en Informática",
    "Medicina",
    "Negocios Internacionales",
    "Negocios y Economía",
    "Notariado",
    "Nutrición",
    "Odontología",
    "Psicología",
    "Psicomotricidad",
    "Psicopedagogía",
    "Recreación Educativa",
    "Sociología",
    "Trabajo Social",
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.signupForm = this.fb.group(
      {
        email: [
          "",
          [Validators.required, Validators.email, emailDomainValidator()],
        ],
        firstName: ["", [Validators.required]],
        lastName: ["", [Validators.required]],
        document: ["", [Validators.required]],
        major: ["", [Validators.required]],
        password: ["", [Validators.required]],
        confirmPassword: ["", [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );

    this.filteredOptions = this.signupForm.get("major")!.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.majors.filter((major) =>
      major.toLowerCase().includes(filterValue)
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get("password")!.value === form.get("confirmPassword")!.value
      ? null
      : { mismatch: true };
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  formatCedula(event: any) {
    let input = event.target.value.replace(/\D/g, ''); // Remove all non-digits
    // Ensure that the input is limited to 8 characters (7 digits + 1 dash)
    input = input.substring(0, 8);

    if (input.length > 7) {
      // Insert dash after the sixth digit
      input = input.substring(0, 7) + '-' + input.substring(7);
    }
    this.signupForm.get('document')?.setValue(input, { emitEvent: false });
}


  signUp() {
    if (this.signupForm.valid) {
      this.submitted = true;
      const { email, document, firstName, lastName, major, password } =
        this.signupForm.value;

      // Sanitize inputs
      const sanitizedEmail = email.trim();
      const sanitizedDocument = document.trim();
      const sanitizedFirstName = firstName.trim();
      const sanitizedLastName = lastName.trim();
      const sanitizedMajor = major.trim();
      const sanitizedPassword = password.trim();
      const defaultRoleId = 1;

      this.authService
        .signUp({
          email: sanitizedEmail,
          document_id: sanitizedDocument,
          password: sanitizedPassword,
          first_name: sanitizedFirstName,
          last_name: sanitizedLastName,
          major: sanitizedMajor,
          role_id: defaultRoleId,
        })
        .subscribe(
          (response) => {
            this.snackbar.open("Registro de usuario éxitoso", "Cerrar", {
              duration: 3000,
              panelClass: ["snackbar-success"],
            });
            this.router.navigate(["/"]);
            this.submitted = false;
          },
          (error) => {
            console.error("Signup failed", error);
            this.snackbar.open("Error al registrar usuario", "Cerrar", {
              duration: 3000,
              panelClass: ["snackbar-error"],
            });
            this.submitted = false;
          }
        );

      // Reset the 'submitted' state after a timeout, regardless of success or failure
      setTimeout(() => {
        this.submitted = false;
      }, 2000);
    }
  }
}

// this.snackbar.open("Error al editar el partido", "Cerrar", {
//   duration: 3000,
//   panelClass: ["snackbar-error"],
// });