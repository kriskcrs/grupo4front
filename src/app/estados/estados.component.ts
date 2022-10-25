import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Md5} from 'ts-md5';
import * as XLSX from 'xlsx';
// modal
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-estados',
  templateUrl: './estados.component.html',
  styleUrls: ['./estados.component.css']
})
export class EstadosComponent implements OnInit {

  // variables
  estado: any = {}
  estadoList: any = []
  msjEliminaCliente: String = ""

  //banderas
  consul: boolean = true
  crea: boolean = false
  elim: boolean= false
  busca: boolean = false

  // modal
  closeResult = '';

  // cryp
  md5: any = new Md5()

  //constructores
  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {

    // consulta de estados
    this.consultaEstados().subscribe(
      (respuesta: any) => this.consultaEstadosResponse(respuesta)
    )
  }

  // menus de pantalla
  menu(x:any){
    this.consul = false;
    this.crea =  false
    this.elim = false

    switch (x){
      case 1:
        this.consul = true; this.consultaEstados().subscribe(
        (respuesta: any) => this.consultaEstadosResponse(respuesta)
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

  // consulta estados
  consultaEstados() {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/estado/consulta", httpOptions).pipe(
      catchError(e => "e")
    )
  }

  //Respuesta para la consulta de las estados
  consultaEstadosResponse(res: any) {
    console.log("res = " + res)

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.estadoList = res
      console.log(this.estadoList)
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
      this.creacionEstado(this.estado).subscribe(
        (respuesta: any) => this.creacionEstadoResponse(respuesta)
      )
    }
  }

  // Crear Estado
  creacionEstado(estado: any) {

    console.log("Creacion de Estado")
    console.log(estado)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/estado/crea", estado, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  creacionEstadoResponse(res: any) {
    console.log(res + " aqui va el res ")

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok

      res = JSON.parse(JSON.stringify(res))
      console.log(res)
      alert("Se creo el estado: " + res.nombreEstado)
      this.estado = {}

    }
  }

}
