import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Md5} from 'ts-md5';
import * as XLSX from 'xlsx';
// modal
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  // variables
  rol: any = {}
  rolList: any = []

  //banderas
  consul: boolean = true
  crea: boolean = false
  elim: boolean= false
  busca: boolean = false

  // modal
  closeResult = '';

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {

    // consulta de roles
    this.consultaRol().subscribe(
      (respuesta: any) => this.consultaRolResponse(respuesta)
    )
  }

  // menus de pantalla
  menu(x:any){
    this.consul = false;
    this.crea =  false
    this.elim = false

    switch (x){
      case 1:
        this.consul = true;
        this.consultaRol().subscribe(
          (respuesta: any) => this.consultaRolResponse(respuesta)
        );
        break;
      case 2: this.crea = true; break;
      case 3: this.elim = true; break;
    }
  }

  // consulta rol
  consultaRol() {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/Rol/consulta", httpOptions).pipe(
      catchError(e => "e")
    )
  }

  //Respuesta para la consulta los terapias
  consultaRolResponse(res: any) {
    console.log("res = " + res)

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.rolList = res
      console.log(this.rolList)
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
      this.creacionRol(this.rol).subscribe(
        (respuesta: any) => this.creacionRolResponse(respuesta)
      )
    }
  }

  // Crear Estado
  creacionRol(rol: any) {

    console.log("Creacion de rol")
    console.log(rol)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/Rol/crea", rol, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  creacionRolResponse(res: any) {
    console.log(res + " aqui va el res ")

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok

      res = JSON.parse(JSON.stringify(res))
      console.log(res)
      alert("Se creo el tipo de identidad: " + res.nombreRol)
      this.rol = {}

    }
  }

}
