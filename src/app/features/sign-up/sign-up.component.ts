import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { emailDomainValidator } from 'src/app/validators/email-domain.validator';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';


@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  hide = true;
  submitted = false;
  filteredOptions: Observable<string[]>;

  majors: string[] = ['Abogacía', 'Acompañamiento Terapéutico', 'Agronomía', 'Analista en Informática', 'Arquitectura', 'Artes Escénicas', 'Artes Visuales', 'Business Analytics', 'Ciencia Política', 'Cine', 'Comunicación', 'Comunicación y Marketing', 'Contador Público', 'Datos y Negocios', 'Desarrollador de Software', 'Dirección de Empresas', 'Economía', 'Educación Inicial', 'Finanzas', 'Fisioterapia', 'Fonoaudiología', 'Gestión Humana', 'Ingeniería Ambiental', 'Ingeniería en Alimentos', 'Ingeniería en Electrónica', 'Ingeniería en Informática', 'Ingeniería Industrial', 'Inteligencia Artificial y Ciencia de Datos', 'Licenciatura en Enfermería', 'Licenciatura en Informática', 'Medicina', 'Negocios Internacionales', 'Negocios y Economía', 'Notariado', 'Nutrición', 'Odontología', 'Psicología', 'Psicomotricidad', 'Psicopedagogía', 'Recreación Educativa', 'Sociología', 'Trabajo Social']
  ;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, emailDomainValidator()]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      major: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

    this.filteredOptions = this.signupForm.get('major')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.majors.filter(major => major.toLowerCase().includes(filterValue));
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value ? null : { mismatch: true };
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.submitted = true;
      const { email, firstName, lastName, major, password } = this.signupForm.value;
      // Sanitize inputs
      const sanitizedEmail = email.trim();
      const sanitizedFirstName = firstName.trim();
      const sanitizedLastName = lastName.trim();
      const sanitizedMajor = major.trim();
      const sanitizedPassword = password.trim();
      
      this.authService.signUp({
        email: sanitizedEmail,
        firstName: sanitizedFirstName,
        lastName: sanitizedLastName,
        major: sanitizedMajor,
        password: sanitizedPassword
      }).subscribe(
        (        response: any) => {
          console.log('Signup successful', response);
          // Handle successful signup (e.g., navigate to login or dashboard)
          this.submitted = false;
        },
        (        error: any) => {
          console.error('Signup failed', error);
          // Handle signup error (e.g., show error message)
          this.submitted = false;
        }
        
      );
      setTimeout(() => {
        this.submitted = false;
      }, 2000);
    }
  }
}
