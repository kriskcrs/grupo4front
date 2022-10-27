import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-reservacion',
  templateUrl: './reservacion.component.html',
  styleUrls: ['./reservacion.component.css']
})
export class ReservacionComponent implements OnInit {

  //variables
  clinicaList: any = []
  clinicaListSede:any = []
  sedesList: any = []
  clinica:any = {}
  horario:any = {}

  // modal
  closeResult = '';

  // banderas
  consul: boolean = true
  crea: boolean = false
  elim: boolean= false
  busca: boolean = false

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.consultaS()
    this.consultaH()
  }

  // menus de pantalla
  menu(x:any){
    this.consul = false;
    this.crea =  false
    this.elim = false

    switch (x){
      case 1: this.consul = true; this.consultaS(); break;
      case 2:
        this.crea = true;
        //Departamentos
        this.consultaSedes().subscribe(
          (respuesta: any) => this.consultaSedesResponse(respuesta)
        )
        break;
      case 3: this.elim = true; break;
    }
  }


  //consulta sedes
  consultaS(){
    this.consultaClinica().subscribe(
      (respuesta: any) => this.consultaClinicaResponse(respuesta)
    )

    this.consultaSedes().subscribe(
      (respuesta: any) => this.consultaSedesResponse(respuesta)
    )


  }
  consultaSedes() {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/sede/consulta", httpOptions).pipe(
      catchError(e => "e")
    )
  }
  consultaSedesResponse(res: any) {
    console.log("res = " + res)

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.sedesList = res
      console.log(this.sedesList)


      this.relacion()
    }
  }
  relacion(){
    this.clinicaListSede = []
    for (let clinica of this.clinicaList){
      for(let sede of this.sedesList){
        if (clinica.sedeIdSede == sede.idSede){
          clinica.sede = sede.sede
        }
      }
      this.clinicaListSede.push(clinica)
    }
  }


  //consulta horario
  consultaH(){
    this.consultaHorario().subscribe(
      (respuesta: any) => this.consultaHorarioResponse(respuesta)
    )
    this.consultaReservacion().subscribe(
      (respuesta: any) => this.consultaReservacionResponse(respuesta)
    )
  }

  consultaReservacion() {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/reservacion/consulta", httpOptions).pipe(
      catchError(e => "e")
    )
  }

  consultaHorario() {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/horario/consulta", httpOptions).pipe(
      catchError(e => "e")
    )
  }
  consultaHorarioResponse(res: any) {
    console.log("res = " + res)

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.sedesList = res
      console.log(this.sedesList)


      this.relacion()
    }
  }
  consultaReservacionResponse(res:any){
    console.log("res = " +res )
    if(res =="e" || res == null){
    console.log("obtuve el dato")
    }

  }



  relacionH(){
    this.clinicaListSede = []
    for (let clinica of this.clinicaList){
      for(let sede of this.sedesList){
        if (clinica.sedeIdSede == sede.idSede){
          clinica.sede = sede.sede
        }
      }
      this.clinicaListSede.push(clinica)
    }
  }



  // consultaDireccion
  consultaClinica() {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/clinica/consulta", httpOptions).pipe(
      catchError(e => "e")
    )
  }
  consultaClinicaResponse(res: any) {
    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.clinicaList = res
      console.log(this.clinicaList)
      console.log("termino response")
    }
  }

  //Creacion de clinica
  formularioCreacion(){
    let formularioValido: any = document.getElementById("createForm");
    if (formularioValido.reportValidity()) {
      this.creacionClinica(this.clinica).subscribe(
        (respuesta: any) => this.creacionClinicaResponse(respuesta)
      )
    }
  }

  // Crear Direccion
  creacionClinica(clinica: any) {

    console.log("Creacion de clinica")
    console.log(clinica)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/clinica/crea", clinica, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  creacionClinicaResponse(res: any) {
    console.log(res + " aqui va el res ")

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok

      res = JSON.parse(JSON.stringify(res))
      console.log(res)
      alert("Se creo la clinica: " + res.clinica)

    }
  }
}
