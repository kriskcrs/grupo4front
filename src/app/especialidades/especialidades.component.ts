import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Md5} from 'ts-md5';
import * as XLSX from 'xlsx';
// modal
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-especialidades',
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.css']
})
export class EspecialidadesComponent implements OnInit {


  // variables
  menuList:any = []
  permisosList:any = []
  especialidadDetalle: any = {}
  especialidad: any = {}
  especialidadesList: any = []
  buscaEsp: String = ""
  msjEliminaCliente: String = ""
  idEspecialidadSelect: any ={}
  idEspecialidad: String = ""

  //banderas
  consul: boolean = true
  crea: boolean = false
  mod: boolean= false
  busca: boolean = false
  encontrado: boolean = false

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

  // cryp
  md5: any = new Md5()

  //constructores
  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.cargaMenus()
    this.cargaPermisos()

    // consulta de especialidades
    this.consultaEspecialidades().subscribe(
      (respuesta: any) => this.consultaEspecialidadesResponse(respuesta)
    )
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

  // menus de pantalla
  menu(x:any){
    this.consul = false;
    this.crea =  false
    this.mod = false

    switch (x){
      case 1:
        this.consul = true; this.consultaEspecialidades().subscribe(
        (respuesta: any) => this.consultaEspecialidadesResponse(respuesta)
        );
        break;
      case 2:
        this.crea = true;
        break;
      case 3:
        this.mod = true;
        this.consultaEspecialidades().subscribe(
          (respuesta: any) => this.consultaEspecialidadesResponse(respuesta)
        );
        break;
    }
  }

  // consulta especialidades
  consultaEspecialidades() {
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

  especialidadSelect(){
    if(this.idEspecialidad !=""){
      this.idEspecialidadSelect ={}
      for( let x of this.especialidadesList){
        if( this.idEspecialidadSelect == x.idTerapia ){
          this.encontrado = false
          this.idEspecialidadSelect = x
        }
      }
    }else {
      this.encontrado = true
      this.idEspecialidadSelect = {}
    }
  }

  //Respuesta para la consulta de las especialidades
  consultaEspecialidadesResponse(res: any) {
    console.log("res = " + res)

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      console.log(res)
      this.especialidadesList = res
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
  formularioCreacion(){
    let formularioValido: any = document.getElementById("createForm");
    if (formularioValido.reportValidity()) {
        // Crecion de direccion
        this.creacionEspecialidad(this.especialidad).subscribe(
          (respuesta: any) => this.creacionEspecialidadResponse(respuesta)
        )
    }
  }

  // Crear Direccion
  creacionEspecialidad(especialidad: any) {

    console.log("Creacion de especialidad")
    console.log(especialidad)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/especialidad/crea", especialidad, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  creacionEspecialidadResponse(res: any) {
    console.log(res + " aqui va el res ")

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      alert("Se creo la especialidad: " + res.especialidad)
      this.especialidad = {}
    }
  }

  //MODULO DE ELIMINACION ---------------------------------------------------------
  //Busca Cliente
  buscaE(){
    console.log(this.buscaEsp)

    this.buscaEspecialidad(this.buscaEspecialidad).subscribe(
      (respuesta: any) => this.buscaEspecialidadResponse(respuesta)
    )
  }
  buscaEspecialidad(buscaEspecialidad: any) {
    console.log(buscaEspecialidad)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    return this.http.get<any>("http://localhost:4043/persona/buscaIdentidad/" + buscaEspecialidad, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  buscaEspecialidadResponse(res: any) {
    console.log(res + " aqui va el res ")

    if (res == "e" || res == null) {
      this.msjEliminaCliente = "No se ha encontrado un cliente con esta identidad"
    } else if (res != null) {

      // ok
       res = JSON.parse(JSON.stringify(res))

      this.especialidadDetalle = res
      console.log(this.especialidadDetalle)
    }
  }

  //Elimina Cliente
  eliminaCliente(){
  let clienteEliminar = this.especialidadDetalle
  }

  modificarCreacion(){
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      // Crecion de direccion
      this.actualizaEspecialidad(this.especialidad).subscribe(
        (respuesta: any) => this.responseActualizaEspecialidad(respuesta)
      )
    }

  }

  actualizaEspecialidad(especialidad:any){
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/especialidad/actualizar", this.especialidad, httpOptions).pipe(
      catchError(e => "e")
    )


  }

  responseActualizaEspecialidad(res:any){
    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      alert("Se Actualizo la especialidad: " + res.especialidad)
      this.especialidad = {}
      location.href = "/especialidades"
    }
  }


}
