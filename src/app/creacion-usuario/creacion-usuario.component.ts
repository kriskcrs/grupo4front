import { Component, OnInit } from '@angular/core';
import {HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-creacion-usuario',
  templateUrl: './creacion-usuario.component.html',
  styleUrls: ['./creacion-usuario.component.css']
})
export class CreacionUsuarioComponent implements OnInit {

  user: any = {}
  direccion: any = {}
  persona: any = {}
  departamento: String = ""
  md5: any = new Md5()

  constructor(private http:HttpClient) { }

  ngOnInit(): void {

    this.persona.nombre = "Diego"
    this.persona.apellido = "Iboy"
    this.persona.telefono = "123455678"
    this.persona.tipoIdentidadIdTipoIdentidad = "1"
    this.persona.identidad = "123414123"
    this.persona.nit = "18236"
    this.persona.email = "d@d.com"
    this.persona.edad = "22"
    this.departamento = "1"
    this.direccion.municipioIdMunicipio = "1"
    this.direccion.calle = "1"
    this.direccion.avenida = "3"
    this.direccion.otros = "253 Zona1"
    this.user.password = "a"
    this.user.passwordConfirm = "a"

  }

  welcome() {
    location.href = "/"
  }

  formularioCreacion(){
    let formularioValido: any = document.getElementById("createForm");
    if (formularioValido.reportValidity()) {

      if(this.user.password == this.user.passwordConfirm){
        // Crecion de direccion
        this.creacionDireccion(this.direccion).subscribe(
          (respuesta: any) => this.creacionDireccionResponse(respuesta)
        )
      }
    }
  }

  // Crear Direccion
  creacionDireccion(direc: any) {

    console.log("Creacion de direccion")
    console.log(direc)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/direccion/crea", direc, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  creacionDireccionResponse(res: any) {
    console.log(res + " aqui va el res ")

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok

      console.log(JSON.parse(JSON.stringify(res)))
      console.log("Seteo de direccion a persona")
      this.persona.direccionIdDireccion = res.idDireccion

      console.log(this.persona)

      // creacion de persona
      this.creacionPersona(this.persona).subscribe(
        (respuesta: any) => this.creacionPersonaResponse(respuesta)
      )
    }
  }

  // Crear Persona
  creacionPersona(person: any) {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/persona/creaCliente", person, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  creacionPersonaResponse(res: any) {
    console.log(res + " aqui va el res ")
    if (res.length == 0) {
      // this.usuarioInvalido = true;
      console.log("paso por null")
    } else if (res == "e") {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      //ok
      console.log("RESPUESTA DE PERSONA" + JSON.stringify(res))
      this.user.usuario = res.usuario

      console.log(this.user)
      // seteo de password
      this.creacionPassword(this.user).subscribe(
        (respuesta: any) => this.creacionPasswordResponse(respuesta)
      )
    }
  }

  // Setear Password
  creacionPassword(us: any) {

    //Enctripcion de contraseña
    us.password = this.md5.appendStr(us.password).end()

    let usCrea: any = {}
    usCrea.usuario = us.usuario
    usCrea.password = us.password

    console.log("--------" + JSON.stringify(usCrea))

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/usuario/actualiza", usCrea, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  creacionPasswordResponse(res: any) {
    console.log(res + " aqui va el res ")
    if (res == "e") {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      alert();
    }
  }

}


