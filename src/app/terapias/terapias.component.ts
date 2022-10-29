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
  menuList:any = []
  permisosList:any = []
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

  //banderas menu
  menu1:boolean = false
  menu2:boolean = false
  menu3:boolean = false
  menu4:boolean = false
  menu5:boolean = false
  menu6:boolean = false
  menu7:boolean = false
  menu8:boolean = false
  menu9:boolean = false
  menu10:boolean = false
  menu11:boolean = false
  permiso1:boolean = false
  permiso2:boolean = false
  permiso4:boolean = false
  permiso3:boolean = false

  // modal
  closeResult = '';

  constructor(private http: HttpClient, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.cargaMenus()
    this.cargaPermisos()
    this.consultas()
  }

  // carga de menus
  cargaMenus(){
    console.log("Carga de menus")

    this.menuList = localStorage.getItem("menus")
    this.menuList = JSON.parse(this.menuList)
    console.log(this.menuList)

    for(let menu of this.menuList){
      switch (menu) {
        case 1: this.menu1 = true; break;
        case 2: this.menu2 = true; break;
        case 3: this.menu3 = true; break;
        case 4: this.menu4 = true; break;
        case 5: this.menu5 = true; break;
        case 6: this.menu6 = true; break;
        case 7: this.menu7 = true; break;
        case 8: this.menu8 = true; break;
        case 9: this.menu9 = true; break;
        case 10: this.menu10 = true; break;
        case 11: this.menu11 = true; break;
      }
    }
  }

  // carga permisos
  cargaPermisos(){
    console.log("Carga de permisos")

    this.permisosList = localStorage.getItem("permisos")
    this.permisosList = JSON.parse(this.permisosList)
    console.log(this.permisosList)

    let cont = 1
    for(let permiso of this.permisosList){
      if(permiso == 1){
        switch (cont){
          case 1: this.permiso1 = true; break;
          case 2: this.permiso2 = true; break;
          case 3: this.permiso3 = true; break;
          case 4: this.permiso4 = true; break;
        }
      }
      cont++
    }
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
      location.href = "/terapias"

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
