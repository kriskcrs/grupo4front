import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Md5} from 'ts-md5';
import * as XLSX from 'xlsx';
// modal
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {setOffsetToUTC} from "ngx-bootstrap/chronos/units/offset";

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  // variables
  menuList:any = []
  permisosList:any = []
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
  departamentoList:any = []
  municipioList:any = []

  //banderas
  consul: boolean = true
  crea: boolean = false
  elim: boolean= false
  modif:boolean = false
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

    // consulta de clientes
    this.consultaCliente().subscribe(
      (respuesta: any) => this.consultaClienteResponse(respuesta)
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
    this.modif = false;

    switch (x){
      case 1:
        this.consul = true; this.consultaCliente().subscribe(
        (respuesta: any) => this.consultaClienteResponse(respuesta)
        );
        break;
      case 2:
        this.crea = true;
        this.consultaCatalogos();
        break;
      case 3:
        this.elim = true;
        this.consultaTipoIdentidad().subscribe(
        (respuesta: any) => this.consultaTipoIdentidadResponse(respuesta)
        );
        break;
    }
  }

  // consultaClientes
  consultaCliente() {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/persona/consultaCliente", httpOptions).pipe(
      catchError(e => "e")
    )
  }

  //Respuesta para la consulta de los clientes
  consultaClienteResponse(res: any) {

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
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

  // Consultas a detalles del cliente
  detallesCliente(content:any, persona: any){
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
    console.log(res + " aqui va el res -> ")


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
    return this.http.post<any>("http://localhost:4043/persona/creaCliente", person, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  creacionPersonaResponse(res: any) {
    console.log(res + " aqui va el res ")
    if(res.codError == 1){
      console.log("Error ya existe")
      alert("¡El cliente ya existe con el numero de identidad o nit!")
      location.href = "/clientes"
    }
    else if (res.length == 0) {
      // this.usuarioInvalido = true;
      console.log("paso por null")
    } else if (res == "e") {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      //ok
      console.log("RESPUESTA DE PERSONA" + JSON.stringify(res))
      this.user.usuario = res.usuario
      console.log("Usuario -> "+ res.usuario)

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
      alert("Tu nuevo usuario es: " + res.usuario)

      this.salir()
    }
  }

  salir(){
    this.persona = {}
  }

  //Catalogos
  consultaCatalogos(){
    //Tipos de identidad
    this.consultaTipoIdentidad().subscribe(
      (respuesta: any) => this.consultaTipoIdentidadResponse(respuesta)
    )

    //Departamentos
    this.consultaDepartamento().subscribe(
      (respuesta: any) => this.consultaDepartamentoResponse(respuesta)
    )
  }

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

  // consulta Municipio
  consultaMuni(){
    this.municipioList = []
    if(this.departamento != ""){
      this.municipioList = []
      this.consultaMunicipio(this.departamento).subscribe(
        (respuesta: any) => this.consultaMunicipioResponse(respuesta)
      )
    }
  }
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




  //MODULO DE ELIMINACION ---------------------------------------------------------
  // consultaTiposIdentidad
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

  //Busca Cliente
  buscaC(){
    console.log(this.buscaIdentidad)

    this.buscaCliente(this.buscaIdentidad).subscribe(
      (respuesta: any) => this.buscaClienteResponse(respuesta)
    )
  }
  buscaCliente(buscaIdentidad: any) {
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
  buscaClienteResponse(res: any) {
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
