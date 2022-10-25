import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { RolesComponent } from './roles/roles.component';
import { TerapiasComponent } from './terapias/terapias.component';
import { AdminRolesComponent } from './admin-roles/admin-roles.component';
import { PruebaComponent } from './prueba/prueba.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BootstrapIconsModule } from 'ng-bootstrap-icons';
import { allIcons } from 'ng-bootstrap-icons/icons';
import { ClientesComponent } from './clientes/clientes.component';
import { EspecialistasComponent } from './especialistas/especialistas.component';
import { EspecialidadesComponent } from './especialidades/especialidades.component';
import { SedesComponent } from './sedes/sedes.component';
import { FacturasComponent } from './facturas/facturas.component';
import { EstadosComponent } from './estados/estados.component';
import { TipoIdentidadComponent } from './tipo-identidad/tipo-identidad.component';
import { DirecionesComponent } from './direciones/direciones.component';
import { CreacionUsuarioComponent } from './creacion-usuario/creacion-usuario.component';
import { ReservacionComponent } from './reservacion/reservacion.component';
import { ClinicasComponent } from './clinicas/clinicas.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RolesComponent,
    TerapiasComponent,
    AdminRolesComponent,
    PruebaComponent,
    WelcomeComponent,
    ClientesComponent,
    EspecialistasComponent,
    EspecialidadesComponent,
    SedesComponent,
    FacturasComponent,
    EstadosComponent,
    TipoIdentidadComponent,
    DirecionesComponent,
    CreacionUsuarioComponent,
    ReservacionComponent,
    ClinicasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    NgbModule,
    BootstrapIconsModule.pick(allIcons)
  ],
  exports: [
    BootstrapIconsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
