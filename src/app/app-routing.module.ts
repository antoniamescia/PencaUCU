import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./features/login/login.component";
import { SignupComponent } from "./features/sign-up/sign-up.component";
import { HomeComponent } from "./features/home/home.component";
import { ProfileComponent } from "./features/profile/profile.component";
import { ScoreboardComponent } from "./features/scoreboard/scoreboard.component";
import { GroupsComponent } from "./features/groups/groups.component";
import { PredictionComponent } from "./features/prediction/prediction.component";

import { AuthGuard } from "./core/guards/auth.guard";
import { AdminHomeComponent } from "./features/admin-home/admin-home.component";
import { AdminGuard } from "./core/guards/admin.guard";
import { CrearPartidoComponent } from "./features/admin-home/crear-partido/crear-partido.component";
import { CargarResultadoComponent } from "./features/admin-home/cargar-resultado/cargar-resultado.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "registro", component: SignupComponent },
  { path: "partidos", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "perfil", component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: "tabla-posiciones",
    component: ScoreboardComponent,
    canActivate: [AuthGuard],
  },
  { path: "grupos", component: GroupsComponent, canActivate: [AuthGuard] },
  {
    path: "pronostico",
    component: PredictionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "admin-home",
    component: AdminHomeComponent,
    canActivate: [AdminGuard],
  },
  {
    path: "crear-partido",
    component: CrearPartidoComponent,
    canActivate: [AdminGuard],
  },
  {
    path: "cargar-resultados",
    component: CargarResultadoComponent,
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
