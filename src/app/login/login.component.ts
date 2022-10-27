import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {HttpHeaders} from '@angular/common/http';
import * as http from "http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //variables
  user: any = {};
  pass: string = ""
  usuarioInvalido: boolean = false;
  msjUsuarioInvalido: String = "El usuario o contraseña son incorrectas."
  menuList: any = {}
  rolList: any = {}
  menuRolList: any = {}


  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    localStorage.clear()
    this.ConsultaCatalogo()

  }

  formulariologin() {
    this.usuarioInvalido = false

    console.log("entro en formulario")
    let formularioValido: any = document.getElementById("loginForm");
    if (formularioValido.reportValidity()) {

      //llamada al servicio de login
      this.servicioLogin().subscribe(
        (respuesta: any) => this.login(respuesta)
      )
    }
  }
  servicioLogin() {
    this.user.usuario = this.user.usuario.toUpperCase()
    console.log(this.user)

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/login/autenticacion", this.user, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  login(res: any) {

    if (res != null) {
      //recibido
      console.log("OK")
      res = JSON.parse(JSON.stringify(res))
      console.log(res)

      if(res.codError == 0){
        // Usuario OK
        console.log(res.codError)
        localStorage.setItem("user", JSON.stringify(res));
        localStorage.setItem("menuList",JSON.stringify(this.menuList))
        console.log("rolList --->  "+JSON.stringify(this.rolList))
        localStorage.setItem("rolList",JSON.stringify(this.rolList))
        localStorage.setItem("menuRol",JSON.stringify(this.menuRolList))
        location.href = "/clientes";
      }else{
        // Fallo por -> 'estado'
        this.msjUsuarioInvalido = res.estado
        this.usuarioInvalido = true

      }
    } else if (res == null){
      this.usuarioInvalido = true

    } else if (res == "e") {
      alert("No hay comunicación con el servidor!!")

    }
  }

  limpiar(){
    this.user = {};
    this.pass  = ""
    this.usuarioInvalido = false;
    this.msjUsuarioInvalido = "El usuario o contraseña son incorrectas."
  }

  crearUsuario() {
    location.href = "/creacion";
  }

  welcome() {
    location.href = "/"
  }

  ConsultaCatalogo(){
    this.ConsultaMenu().subscribe(
      (respuesta: any) => this.ConsultaMenuResponse(respuesta)
    )
    this.ConsultaRol().subscribe(
      (respuesta:any) => this.ConsultaRolResponse(respuesta)
    )
    this.ConsultaMenuRol().subscribe(
      (respuesta:any) => this.ConsultaMenuRolResponse(respuesta)
    )
  }

// Menu
  ConsultaMenu(){
    console.log("llama al servicio -> Menu -> " )
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/menu/consulta",  httpOptions).pipe(
      catchError(e => "e")
    )
  }
  ConsultaMenuResponse(res: any) {
    console.log("res = " + res)

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.menuList = res
      console.log(this.menuList)
    }
  }

// Rol
  ConsultaRol(){
    console.log("llama al servicio -> Rol -> " )
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/rol/consulta",  httpOptions).pipe(
      catchError(e => "e")
    )
  }
  ConsultaRolResponse(res: any) {
   console.log("paso por la peticion de rol consulta -> " +res)

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.rolList = res
      console.log(this.rolList)
    }
  }

// Menu_rol
  ConsultaMenuRol(){
    console.log("llama al servicio -> MenuRol -> " )
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/menu/consultaRol",  httpOptions).pipe(
      catchError(e => "e")
    )
  }
  ConsultaMenuRolResponse(res: any) {
    console.log("paso por la peticion de Menu_Rol consulta -> " +res)

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.menuRolList = res
      console.log(this.menuRolList)
    }
  }



}
