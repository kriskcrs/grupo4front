import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-admin-roles',
  templateUrl: './admin-roles.component.html',
  styleUrls: ['./admin-roles.component.css']
})
export class AdminRolesComponent implements OnInit {

  rol:any={};

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  creacionRol(){
    let validForm : any = document.getElementById("form");
    if(validForm.reportValidity()){
      this.createService().subscribe(
        (response:any)=>this.confirmCreation(response)
      )
    }
  }

  createService(){
    var httpOptions={
      headers:new HttpHeaders({
        'Content-Type':'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4042/", this.rol, httpOptions).pipe(
      catchError(e=>"e")
    )
  }

  confirmCreation(res:any){
    if(res=="e"){
      console.log("Error peticion");
    }else{
      this.rol = {};
      alert("Rol creado con exito: ")
      localStorage.setItem("user", JSON.stringify(res))
      location.href="/roles"
    }
  }

  regreso(){
    location.href="/roles"
  }

}
