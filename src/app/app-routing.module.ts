import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RolesComponent } from "./roles/roles.component";
import { TerapiasComponent } from "./terapias/terapias.component";
import { AdminRolesComponent } from "./admin-roles/admin-roles.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { PruebaComponent} from "./prueba/prueba.component";
import { ClientesComponent} from "./clientes/clientes.component";
import { EspecialidadesComponent} from "./especialidades/especialidades.component";
import { EspecialistasComponent} from "./especialistas/especialistas.component";
import { SedesComponent} from "./sedes/sedes.component";
import { FacturasComponent} from "./facturas/facturas.component";
import { EstadosComponent} from "./estados/estados.component";
import { TipoIdentidadComponent} from "./tipo-identidad/tipo-identidad.component";
import { DirecionesComponent} from "./direciones/direciones.component";
import { CreacionUsuarioComponent } from "./creacion-usuario/creacion-usuario.component";
import {ClinicasComponent} from "./clinicas/clinicas.component";
import {ReservacionComponent} from "./reservacion/reservacion.component";

const routes: Routes = [

  {path:'',component:WelcomeComponent},
  {path:'home',component: HomeComponent},
  {path:'roles',component: RolesComponent},
  {path:'terapias',component: TerapiasComponent},
  {path:'admin-roles',component: AdminRolesComponent},
  {path:'login',component: LoginComponent},
  {path:'prueba', component: PruebaComponent},
  {path:'clientes', component: ClientesComponent},
  {path:'especialidades', component: EspecialidadesComponent},
  {path:'especialistas', component: EspecialistasComponent},
  {path:'sedes', component: SedesComponent},
  {path:'facturas', component: FacturasComponent},
  {path:'estados', component: EstadosComponent},
  {path:'tipoDeidentidades', component: TipoIdentidadComponent},
  {path:'direcciones', component: DirecionesComponent},
  {path:'creacion', component: CreacionUsuarioComponent},
  {path:'clinicas',component: ClinicasComponent},
  {path:'reservacion', component: ReservacionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
