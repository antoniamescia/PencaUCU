import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { MatListModule } from '@angular/material/list'; 
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/login/login.component';
import { SignupComponent } from './features/sign-up/sign-up.component';
import { HomeComponent } from './features/home/home.component';
import { MatchCardComponent } from './features/home/match-card/match-card.component';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';
import { MatchTabsComponent } from './features/home/match-tabs/match-tabs.component';
import { ProfileComponent } from './features/profile/profile.component';
import { ScoreboardComponent } from './features/scoreboard/scoreboard.component';
import { GroupsComponent } from './features/groups/groups.component';
import { PredictionComponent } from './features/prediction/prediction.component';
import { PredictionModalComponent } from './features/home/predictionmodal/predictionmodal.component';

import { AuthInterceptor }  from './core/interceptors/auth.interceptor';
import { AdminHomeComponent } from './features/admin-home/admin-home.component';
import { AdminSidenavComponent } from './features/admin-home/admin-sidenav/admin-sidenav.component';
import { CrearPartidoComponent } from './features/admin-home/crear-partido/crear-partido.component';
import { CargarResultadoComponent } from './features/admin-home/cargar-resultado/cargar-resultado.component';
import { AdminMatchTabsComponent } from './features/admin-home/admin-match-tabs/admin-match-tabs.component';
import { AdminMatchCardComponent } from './features/admin-home/admin-match-card/admin-match-card.component';
import { CreateMatchModalComponent } from './features/admin-home/create-match-modal/create-match-modal.component';
import { DeleteMatchModalComponent } from './features/admin-home/delete-match-modal/delete-match-modal.component';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    MatchCardComponent,
    SidenavComponent,
    MatchTabsComponent,
    ProfileComponent,
    ScoreboardComponent,
    GroupsComponent,
    PredictionComponent,
    PredictionModalComponent,
    AdminHomeComponent,
    AdminSidenavComponent,
    CrearPartidoComponent,
    CargarResultadoComponent,
    AdminMatchTabsComponent,
    AdminMatchCardComponent,
    CreateMatchModalComponent,
    DeleteMatchModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
