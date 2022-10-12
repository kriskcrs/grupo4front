import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ClientesComponent } from './clientes/clientes.component';
import { EspecialistasComponent } from './especialistas/especialistas.component';
import { EspecialidadesComponent } from './especialidades/especialidades.component';
import { SedesComponent } from './sedes/sedes.component';
import { ReservacionComponent } from './reservacion/reservacion.component';

const routes: Routes = [

  {path:'',component:LoginComponent},
  {path:'home',component: HomeComponent},
  {path: 'clientes',component: ClientesComponent},
  {path: 'especialistas',component: EspecialistasComponent},
  {path: 'especialidades',component: EspecialidadesComponent},
  {path: 'sedes',component: SedesComponent},
  {path: 'reservacion',component: ReservacionComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
