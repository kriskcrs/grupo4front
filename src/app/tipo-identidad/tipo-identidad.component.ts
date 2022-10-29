import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Md5} from 'ts-md5';
import * as XLSX from 'xlsx';
// modal
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tipo-identidad',
  templateUrl: './tipo-identidad.component.html',
  styleUrls: ['./tipo-identidad.component.css']
})
export class TipoIdentidadComponent implements OnInit {

  // variables
  menuList:any = []
  permisosList:any = []
  tipoIdentidad: any = {}
  tipoIdentidadList: any = []
  msjEliminaCliente: String = ""

  //banderas
  consul: boolean = true
  crea: boolean = false
  elim: boolean= false
  busca: boolean = false

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
    // consulta de tipos de indentidad
    this.consultaTipoIdentidad().subscribe(
      (respuesta: any) => this.consultaTipoIdentidadResponse(respuesta)
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
    this.elim = false

    switch (x){
      case 1:
        this.consul = true;
        this.consultaTipoIdentidad().subscribe(
        (respuesta: any) => this.consultaTipoIdentidadResponse(respuesta)
        );
        break;
      case 2:
        this.crea = true;
        break;
      case 3:
        this.elim = true;
        // this.consultaTipoIdentidad().subscribe(
        // (respuesta: any) => this.consultaTipoIdentidadResponse(respuesta)
        // );
        break;
    }
  }

  // consulta tipo de identidad
  consultaTipoIdentidad() {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/tipoIdentidad/consulta", httpOptions).pipe(
      catchError(e => "e")
    )
  }

  //Respuesta para la consulta de los tipos de identidad
  consultaTipoIdentidadResponse(res: any) {
    console.log("res = " + res)

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.tipoIdentidadList = res
      console.log(this.tipoIdentidadList)
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
      this.creacionTipoIdentidad(this.tipoIdentidad).subscribe(
        (respuesta: any) => this.creacionTipoIdentidadResponse(respuesta)
      )
    }
  }

  // Crear Estado
  creacionTipoIdentidad(tipoIdentidad: any) {

    console.log("Creacion de tipo identidad")
    console.log(tipoIdentidad)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/tipoIdentidad/crea", tipoIdentidad, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  creacionTipoIdentidadResponse(res: any) {
    console.log(res + " aqui va el res ")

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok

      res = JSON.parse(JSON.stringify(res))
      console.log(res)
      alert("Se creo el tipo de identidad: " + res.tipoIdentidad)
      this.tipoIdentidad = {}

    }
  }

}
