import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {RolesComponent} from "./roles/roles.component";
import {TerapiasComponent} from "./terapias/terapias.component";
import {AdminRolesComponent} from "./admin-roles/admin-roles.component";

const routes: Routes = [

  {path:'',component:LoginComponent},
  {path:'home',component: HomeComponent},
  {path:'roles',component: RolesComponent},
  {path:'terapias',component: TerapiasComponent},
  {path:'admin-roles',component: AdminRolesComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
