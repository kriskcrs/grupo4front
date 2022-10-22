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
  especialidadDetalle: any = {}
  especialidad: any = {}
  especialidadesList: any = []
  buscaEsp: String = ""
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

    // consulta de especialidades
    this.consultaEspecialidades().subscribe(
      (respuesta: any) => this.consultaEspecialidadesResponse(respuesta)
    )
  }

  // menus de pantalla
  menu(x:any){
    this.consul = false;
    this.crea =  false
    this.elim = false

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
        this.elim = true;
        // this.consultaTipoIdentidad().subscribe(
        // (respuesta: any) => this.consultaTipoIdentidadResponse(respuesta)
        // );
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
    return this.http.get<any>("http://localhost:4043/Especialidad/consulta", httpOptions).pipe(
      catchError(e => "e")
    )
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
    return this.http.post<any>("http://localhost:4043/Especialidad/crea", especialidad, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  creacionEspecialidadResponse(res: any) {
    console.log(res + " aqui va el res ")

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      console.log(JSON.parse(JSON.stringify(res)))
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
}
