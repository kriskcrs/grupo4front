import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reservacion',
  templateUrl: './reservacion.component.html',
  styleUrls: ['./reservacion.component.css']
})
export class ReservacionComponent implements OnInit {

  //variables
  clinicaList: any = []
  clinicaEspecialidadList:any = []
  especialidadList:any = []
  clinicaEspecialidadRelacionadaList:any = []
  clinicaListSede: any = []
  sedesList: any = []
  especialistaList:any = []
  clinica: any = {}
  horarioList:any = []
  reservacion:any = {}
  sede:any
  especialidad:any

  //calendario
  model: NgbDateStruct | undefined;

  // modal
  closeResult = '';

  // banderas
  consul: boolean = false
  crea: boolean = true
  elim: boolean = false
  busca: boolean = false

  constructor(private http: HttpClient, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.consultaS()
  }

  // menus de pantalla
  menu(x: any) {
    this.consul = false;
    this.crea = false
    this.elim = false

    switch (x) {
      case 1:
        this.consul = true;
        this.consultaS();
        break;
      case 2:
        this.crea = true;
        this.catalogos()
        break;
      case 3:
        this.elim = true;
        break;
    }
  }


  //consulta sedes
  consultaS() {
    // this.consultaClinica().subscribe(
    //   (respuesta: any) => this.consultaClinicaResponse(respuesta)
    // )

    this.consultaSedes().subscribe(
      (respuesta: any) => this.consultaSedesResponse(respuesta)
    )
  }

  //Catalogos
  catalogos(){
    this.consultaHorario().subscribe(
      (respuesta: any) => this.consultaHorarioResponse(respuesta)
    )
    this.consultaSedes().subscribe(
      (respuesta: any) => this.consultaSedesResponse(respuesta)
    )
  }

  //Consulta Horario
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
      this.horarioList = res
      console.log(this.horarioList)
    }
  }

  //consulta Sede
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
    }
  }

  // consulta Clinicas
  buscaClinicas(){
    this.clinicaList = []
    this.consultaClinica(this.sede).subscribe(
      (respuesta: any) => this.consultaClinicaResponse(respuesta)
    )
  }
  consultaClinica(id:number) {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/clinica/consulta/" + id, httpOptions).pipe(
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

  // consulta Clinica especialidad
  buscaClinicaEspecialidad(){
    this.clinicaEspecialidadList = []
    this.consultaClinicaEspecialidad(this.clinica).subscribe(
      (respuesta: any) => this.consultaClinicaEspecialidadResponse(respuesta)
    )
  }
  consultaClinicaEspecialidad(id:number) {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/clinicaEspecialidad/consulta/" + id, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  consultaClinicaEspecialidadResponse(res: any) {
    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.clinicaEspecialidadList = res
      console.log(this.clinicaEspecialidadList)
      console.log("termino response")

      this.consultaEspecialidad().subscribe(
        (respuesta: any) => this.consultaEspecialidadResponse(respuesta)
      )
    }
  }

  // consulta especialidad
  consultaEspecialidad() {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/especialidad/consulta", httpOptions).pipe(
      catchError(e => "e")
    )
  }
  consultaEspecialidadResponse(res: any) {
    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.especialidadList = res
      console.log(this.especialidadList)
      console.log("termino response")

      this.relacion();
    }
  }

  relacion(){
    this.clinicaEspecialidadRelacionadaList = []
    for (let clinicaEspecialidad of this.clinicaEspecialidadList){
      for (let especialidad of this.especialidadList){
        if(clinicaEspecialidad.especialidadIdEspecialidad == especialidad.idEspecialidad){
          clinicaEspecialidad.especialidad = especialidad.especialidad
        }
      }
      this.clinicaEspecialidadRelacionadaList.push(clinicaEspecialidad)
    }

    console.log("clinica especialidad")
    console.log(this.clinicaEspecialidadRelacionadaList)
  }

  // consulta especialistas
  buscaEspecialista(){
    let especialidadSelect:any = {}
    for(let clinicaEspecialidadRelacionado of this.clinicaEspecialidadRelacionadaList){
      if(clinicaEspecialidadRelacionado.clinicaEspecialidad = this.reservacion.clinicaEspecialidadIdClinicaEspecialidad){
        especialidadSelect = clinicaEspecialidadRelacionado
      }
    }

    this.especialistaList = []
    this.consultaEspecialista(especialidadSelect.especialidadIdEspecialidad).subscribe(
      (respuesta: any) => this.consultaEspecialistasesponse(respuesta)
    )
  }
  consultaEspecialista(id:number) {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/especialista/consulta/" + id, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  consultaEspecialistasesponse(res: any) {
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









  //Creacion de clinica especialidad
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
