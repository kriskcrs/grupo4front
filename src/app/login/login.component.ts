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


  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    localStorage.clear()
  }

  formulariologin() {
    this.usuarioInvalido = false

    console.log("entro en formulario")
    let formularioValido: any = document.getElementById("loginForm");
    if (formularioValido.reportValidity()) {

      console.log(this.user)

      //llamada al servicio de login
      this.servicioLogin().subscribe(
        (respuesta: any) => this.login(respuesta)
      )
    }
  }


  servicioLogin() {
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
}
