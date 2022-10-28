import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Md5} from 'ts-md5';
import * as XLSX from 'xlsx';
// modal
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-terapias',
  templateUrl: './terapias.component.html',
  styleUrls: ['./terapias.component.css']
})
export class TerapiasComponent implements OnInit {

  // variables
  terapia: any = {}
  terapiaList: any = []
  terapiaListEspecialidad: any = []
  especialidadList: any = []
  terapiaListSelect: any = {}
  idTerapia: String = ""

  //banderas
  consul: boolean = true
  crea: boolean = false
  mod: boolean = false
  encontrado: boolean = true

  // modal
  closeResult = '';

  constructor(private http: HttpClient, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.consultas()
  }

  consultas(){
    // consulta de terapias
    this.consultaTerapia().subscribe(
      (respuesta: any) => this.consultaTerapiaResponse(respuesta)
    )

    this.consultaEspecialidad().subscribe(
      (respuesta: any) => this.consultaEspecialidadResponse(respuesta)
    )

  }

  // menus de pantalla
  menu(x: any) {
    this.consul = false;
    this.crea = false
    this.mod = false


    switch (x) {
      case 1:
        this.consul = true;
        this.consultas()
        break;
      case 2:
        this.crea = true;
        this.consultaEspecialidad().subscribe(
          (respuesta: any) => this.consultaEspecialidadResponse(respuesta)
        )
        break;
      case 3:
        this.mod = true;
        this.encontrado = true
        break;
    }
  }


  terapiaSelect(){

    if(this.idTerapia !=""){
      this.terapiaListSelect ={}
      for( let x of this.terapiaList){
        if( this.idTerapia == x.idTerapia ){
          this.encontrado = false
          this.terapiaListSelect = x
          }
       }
    }else {
      this.encontrado = true
      this.terapiaListSelect = {}
    }

  }

  // consulta Terapia
  consultaTerapia() {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/terapia/consulta", httpOptions).pipe(
      catchError(e => "e")
    )
  }

  //Respuesta para la consulta los roles
  consultaTerapiaResponse(res: any) {

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.terapiaList = res

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

  //Respuesta para la consulta los roles
  consultaEspecialidadResponse(res: any) {

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.especialidadList = res
      this.relacion()
    }
  }

  relacion(){
    this.terapiaListEspecialidad = []
    for (let terapia of this.terapiaList){
      for (let especialidad of this.especialidadList){
        if(terapia.especialidadIdEspecialidad == especialidad.idEspecialidad){
          terapia.especialidad = especialidad.especialidad
        }
      }
      this.terapiaListEspecialidad.push(terapia)
    }
  }

  //EXPORT TABLE
  name = 'ExcelSheet.xlsx';

  exportToExcel(): void {
    let element = document.getElementById('tablaClientes');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }


  // MODULO DE CREACION -----------------------------------------------------------
  formularioCreacion() {
    let formularioValido: any = document.getElementById("createForm");
    if (formularioValido.reportValidity()) {

      // Crecion de direccion
      this.creacionTerapia(this.terapia).subscribe(
        (respuesta: any) => this.creacionTerapiaResponse(respuesta)
      )
    }
  }

  // Crear Terapia
  creacionTerapia(terapia: any) {

    console.log("Creacion de terapia")
    console.log(terapia)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/terapia/crea", terapia, httpOptions).pipe(
      catchError(e => "e")
    )
  }

  creacionTerapiaResponse(res: any) {
    console.log(res + " aqui va el res ")

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok

      res = JSON.parse(JSON.stringify(res))
      console.log(res)
      alert("Se creo el tipo de terapia: " + res.terapia)
      this.terapia = {}

    }
  }



  formularioModifica(){
    console.log("entro a formulario modifica")
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {

      // Crecion de direccion
      this.terapiaListSelect.idTerapia = this.idTerapia
      this.actualizarTerapia(this.terapiaListSelect).subscribe(
        (respuesta: any) => this.actualizacionTerapiaResponse(respuesta)
      )
    }
  }


  // Actualiza Terapia
  actualizarTerapia(terapia: any) {

    console.log("Actualiza de terapia")
    console.log(terapia)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/terapia/actualiza", terapia, httpOptions).pipe(
      catchError(e => "e")
    )
  }

  actualizacionTerapiaResponse(res: any) {
    console.log(res + " aqui va el res ")

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok

      res = JSON.parse(JSON.stringify(res))
      console.log(res)
      alert("Se actualiza el tipo de terapia: " + res.terapia)
      this.terapia = {}
      this.consul =true
      this.mod = false

    }
  }
}
