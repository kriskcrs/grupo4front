import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.css']
})
export class SedesComponent implements OnInit {

  //variables
  sedeList: any = []
  sedeDireccion:any = []
  sedeSelec:any = []
  sede:any = {}
  direccion:any = {}
  departamento:String = ""
  departamentoList:any = []
  municipioList:any = []

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
        this.consultaDepartamento().subscribe(
          (respuesta: any) => this.consultaDepartamentoResponse(respuesta)
        )
        break;
      case 3: this.elim = true; break;
    }
  }


  //consulta sedes
  consultaS(){
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
      this.sedeList = res
      console.log(this.sedeList)
    }
  }

  direccionSede(content:any, sede:any){
    this.sedeSelec = sede
    this.consultaDireccion(sede.direccionIdDireccion).subscribe(
      (respuesta: any) => this.consultaDireccionResponse(respuesta)
    )

    this.sedeSelec.clinicas = this.sedeSelec.clinicaList.length
    console.log("Cantidad de clinicas:" + this.sedeSelec.clinicas)
    setTimeout(() => {
        this.openXl(content)
      },
      700);
  }

  // consultaDireccion
  consultaDireccion(id: any) {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/direccion/consulta/" + id, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  consultaDireccionResponse(res: any) {

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.sedeDireccion = res
      console.log(this.sedeDireccion)
      console.log("termino response")
    }
  }

  //consulta departamentos
  consultaDepartamento() {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/departamento/consulta", httpOptions).pipe(
      catchError(e => "e")
    )
  }
  consultaDepartamentoResponse(res: any) {
    console.log("res = " + res)

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.departamentoList = res
      console.log(this.departamentoList)
    }
  }

  //consulta municipios
  consultaMuni(){
    this.municipioList = []
    if(this.departamento != ""){
      this.municipioList = []
      this.consultaMunicipio(this.departamento).subscribe(
        (respuesta: any) => this.consultaMunicipioResponse(respuesta)
      )
    }
  }

  // consulta Municipio
  consultaMunicipio(id:any) {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/municipio/consulta/" + id, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  consultaMunicipioResponse(res: any) {
    console.log("res = " + res)

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.municipioList = res
      console.log(this.municipioList)
    }
  }

  //MODAL
  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openXl(content:any) {
    this.modalService.open(content, { size: 'xl', centered: true});
  }

  //MODAL
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  //Creacion de Sede
  formularioCreacion(){
    let formularioValido: any = document.getElementById("createForm");
    if (formularioValido.reportValidity()) {
      this.creacionDireccion(this.direccion).subscribe(
        (respuesta: any) => this.creacionDireccionResponse(respuesta)
      )
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

      res = JSON.parse(JSON.stringify(res))
      this.sede.direccionIdDireccion = res.idDireccion
      console.log(this.sede)

      // creacion de persona
      this.creacionSede(this.sede).subscribe(
        (respuesta: any) => this.creacionSedeResponse(respuesta)
      )
    }
  }

  // Crear Sede
  creacionSede(sede: any) {

    console.log("Creacion de sede")
    console.log(sede)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/sede/crea", sede, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  creacionSedeResponse(res: any) {
    console.log(res + " aqui va el res ")

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok

      res = JSON.parse(JSON.stringify(res))
      alert("Se creo la sede: " + res.sede)
    }
  }


}
