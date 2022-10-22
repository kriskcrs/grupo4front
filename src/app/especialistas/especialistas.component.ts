import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Md5} from 'ts-md5';
import * as XLSX from 'xlsx';

// modal
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-especialistas',
  templateUrl: './especialistas.component.html',
  styleUrls: ['./especialistas.component.css']
})
export class EspecialistasComponent implements OnInit {

  // variables
  departamento: String = ""
  persona: any = {}
  personaDetalle: any = []
  direccion: any = {}
  direccionCliente: any = []
  user: any = {}
  personasList: any = []
  tipoIdentidadList: any = []
  buscaIdentidad: any = {}
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

    // consulta de clientes
    this.consultaEspecialista().subscribe(
      (respuesta: any) => this.consultaEspecialistaResponse(respuesta)
    )
  }

  // menus de pantalla
  menu(x:any){
    this.consul = false;
    this.crea =  false
    this.elim = false

    switch (x){
      case 1: this.consul = true; this.consultaEspecialista().subscribe(
        (respuesta: any) => this.consultaEspecialistaResponse(respuesta)
      ); break;
      case 2: this.crea = true;  break;
      case 3: this.elim = true; this.consultaTipoIdentidad().subscribe(
        (respuesta: any) => this.consultaTipoIdentidadResponse(respuesta)
      ); break;
    }
  }

  // consultaEspecialistas
  consultaEspecialista() {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/persona/consultaEspecialista", httpOptions).pipe(
      catchError(e => "e")
    )
  }

  //Respuesta para la consulta de los clientes
  consultaEspecialistaResponse(res: any) {
    console.log("res = " + res)

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      console.log(res)
      this.personasList = res
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

  // Consultas a detalles del especialista
  detallesEspecialista(content:any, persona: any){
    this.personaDetalle = persona
    console.log(this.personaDetalle)

    // consulta de direccion
    this.consultaDireccion(persona.direccionIdDireccion).subscribe(
      (respuesta: any) => this.consultaDireccionResponse(respuesta)
    )

    setTimeout(() => {
      console.log(this.direccionCliente[0].otros)
      this.openXl(content)
      },
      1000);

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

  //Respuesta para la consulta de la direccion
  consultaDireccionResponse(res: any) {

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.direccionCliente = res
      console.log("termino response")
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


  // MODULO DE CREACION -----------------------------------------------------------
  formularioCreacion(){
    let formularioValido: any = document.getElementById("createForm");
    if (formularioValido.reportValidity()) {

      if(this.user.password == this.user.passwordConfirm){
        // Crecion de direccion
        this.creacionDireccion(this.direccion).subscribe(
          (respuesta: any) => this.creacionDireccionResponse(respuesta)
        )
      }
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

      console.log(JSON.parse(JSON.stringify(res)))
      console.log("Seteo de direccion a persona")
      this.persona.direccionIdDireccion = res.idDireccion

      console.log(this.persona)

      // creacion de persona
      this.creacionPersona(this.persona).subscribe(
        (respuesta: any) => this.creacionPersonaResponse(respuesta)
      )
    }
  }

  // Crear Persona
  creacionPersona(person: any) {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/persona/creaEspecialista", person, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  creacionPersonaResponse(res: any) {
    console.log(res + " aqui va el res ")
    if (res.length == 0) {
      // this.usuarioInvalido = true;
      console.log("paso por null")
    } else if (res == "e") {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      //ok
      console.log("RESPUESTA DE PERSONA" + JSON.stringify(res))
      this.user.usuario = res.usuario

      console.log(this.user)
      // seteo de password
      this.creacionPassword(this.user).subscribe(
        (respuesta: any) => this.creacionPasswordResponse(respuesta)
      )
    }
  }

  // Setear Password
  creacionPassword(us: any) {

    //Enctripcion de contraseña
    us.password = this.md5.appendStr(us.password).end()

    let usCrea: any = {}
    usCrea.usuario = us.usuario
    usCrea.password = us.password

    console.log("--------" + JSON.stringify(usCrea))

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/usuario/actualiza", usCrea, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  creacionPasswordResponse(res: any) {
    console.log(res + " aqui va el res ")
    if (res.length == 0) {
      // this.usuarioInvalido = true;
      console.log("paso por null")
    } else if (res == "e") {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {

    }
  }


  //MODULO DE ELIMINACION ---------------------------------------------------------
  // consultaTiposIdentidad
  consultaTipoIdentidad() {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/TipoIdentidad/consulta", httpOptions).pipe(
      catchError(e => "e")
    )
  }

  //Respuesta para consultaTiposIdentidad
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

  //Busca Especialista
  buscaE(){
    console.log(this.buscaIdentidad)

    this.buscaEspecialista(this.buscaIdentidad).subscribe(
      (respuesta: any) => this.buscaEspecialistaResponse(respuesta)
    )
  }
  buscaEspecialista(buscaIdentidad: any) {
    console.log(buscaIdentidad)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    let datos: String = buscaIdentidad.tipoIdentidadIdTipoIdentidad + "/" + buscaIdentidad.identidad

    return this.http.get<any>("http://localhost:4043/persona/buscaIdentidad/" + datos, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  buscaEspecialistaResponse(res: any) {
    console.log(res + " aqui va el res ")

    if (res == "e" || res == null) {
      this.msjEliminaCliente = "No se ha encontrado un cliente con esta identidad"
    } else if (res != null) {

      // ok
       res = JSON.parse(JSON.stringify(res))

      if (res.nombre == "admin2"){
        console.log(JSON.parse(JSON.stringify(res)))
        this.msjEliminaCliente = "No se ha encontrado un cliente con esta identidad"
      }else{
        this.personaDetalle = res
        console.log(this.personaDetalle)

        if(this.personaDetalle.usuarioList[0].historialList[0].estadoIdEstado != 1){
          this.msjEliminaCliente = "Cliente no se encuentra Activo"
        }else if (this.personaDetalle.length <= 0){
          this.msjEliminaCliente = "No se ha encontrado un cliente con esta identidad"
        }else{
          this.busca = true
        }
      }
    }
  }

  //Elimina Cliente
  eliminaCliente(){
  let clienteEliminar = this.personaDetalle



  }
}
