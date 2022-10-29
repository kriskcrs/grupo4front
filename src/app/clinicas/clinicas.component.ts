import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import * as XLSX from "xlsx";

@Component({
  selector: 'app-clinicas',
  templateUrl: './clinicas.component.html',
  styleUrls: ['./clinicas.component.css']
})
export class ClinicasComponent implements OnInit {

  //variables
  menuList:any = []
  permisosList:any = []
  clinicaList: any = []
  clinicaListSede:any = []
  clinicaSelect:any = []
  clinicaEspecialidadList:any = []
  especialidadList:any =  []
  especialidadClinicaSelect:any = []
  especialidadclinicaSelectDispoible:any = []
  creaClinicaEspecialidad:any = {}
  sedesList: any = []
  clinica:any = {}

  // modal
  closeResult = '';

  // banderas
  consul: boolean = true
  crea: boolean = false
  elim: boolean= false
  busca: boolean = false
  creaClinicaEspecialidadBandera = false

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

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.cargaMenus()
    this.cargaPermisos()
    this.consultaS()

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
      case 1: this.consul = true; this.consultaS(); break;
      case 2:
        this.crea = true;
        //Departamentos
        this.consultaSedes().subscribe(
          (respuesta: any) => this.consultaSedesResponse(respuesta)
        )
        break;
      case 3: this.elim = true; break;
    }
  }

  //EXPORT TABLE
  name = 'ExcelSheet.xlsx';
  exportToExcel(): void {
    let element = document.getElementById('tabla');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }

  //consulta sedes
  consultaS(){
    this.consultaClinica().subscribe(
      (respuesta: any) => this.consultaClinicaResponse(respuesta)
    )

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
      this.sedesList = res
      console.log(this.sedesList)


      this.relacion(1)
    }
  }

  relacion(bandera:any){
    console.log("Entra en relacion")

    switch (bandera){
      case 1:
        this.clinicaListSede = []
        for (let clinica of this.clinicaList){
          for(let sede of this.sedesList){
            if (clinica.sedeIdSede == sede.idSede){
              clinica.sede = sede.sede
            }
          }
          this.clinicaListSede.push(clinica)
        }
        break;
      case 2:
        console.log("Entra en caso 2")
        this.especialidadClinicaSelect = []
        this.especialidadclinicaSelectDispoible = []

        console.log("Listado de especialidades")
        console.log(this.clinicaEspecialidadList)

        if (this.clinicaEspecialidadList.length < 1){
          this.especialidadclinicaSelectDispoible = this.especialidadList
        }else{
          for (let clinicaEspecialidad of this.clinicaEspecialidadList){
            for(let especialidad of this.especialidadList){

              console.log("clinicaEspecialidad a Recorrer")

              if(clinicaEspecialidad.especialidadIdEspecialidad == especialidad.idEspecialidad){
                clinicaEspecialidad.especialidad = especialidad.especialidad
              }else{
                console.log("entro en else")
                this.especialidadclinicaSelectDispoible.push(especialidad)
              }
            }
            this.especialidadClinicaSelect.push(clinicaEspecialidad)
          }
          console.log("especialidadclinicaSelectDispoible" + this.especialidadclinicaSelectDispoible)
        }
    }
  }

  // consultaDireccion
  consultaClinica() {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/clinica/consulta", httpOptions).pipe(
      catchError(e => "e")
    )
  }
  consultaClinicaResponse(res: any) {
    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.clinicaList = res
      console.log(this.clinicaList)
      console.log("termino response")
    }
  }

  //Creacion de clinica
  formularioCreacion(){
    let formularioValido: any = document.getElementById("createForm");
    if (formularioValido.reportValidity()) {
      this.creacionClinica(this.clinica).subscribe(
        (respuesta: any) => this.creacionClinicaResponse(respuesta)
      )
    }
  }

  // Crear Direccion
  creacionClinica(clinica: any) {

    console.log("Creacion de clinica")
    console.log(clinica)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/clinica/crea", clinica, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  creacionClinicaResponse(res: any) {
    console.log(res + " aqui va el res ")

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok

      res = JSON.parse(JSON.stringify(res))
      console.log(res)
      alert("Se creo la clinica: " + res.clinica)

    }
  }

  clinicaEspecialidad(content:any, clinica:any){

    this.clinicaSelect = clinica
    // consulta de direccion
    this.consultaClinicaEspecialidad(clinica.idclinica).subscribe(
      (respuesta: any) => this.consultaClinicaEspecialidadResponse(respuesta)
    )

    setTimeout(() => {
        // console.log(this.direccionCliente[0].otros)
        this.openXl(content)
      },
      700);
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

  // consulta Clinica Especialidad
  consultaClinicaEspecialidad(id:any) {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/clinicaEspecialidad/consulta/" + id, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  consultaClinicaEspecialidadResponse(res: any) {
    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.clinicaEspecialidadList = res
      console.log(this.clinicaEspecialidadList)
      console.log("termino response")

      this.consultaEspecialidad().subscribe(
        (respuesta: any) => this.consultaEspecialidadResponse(respuesta)
      )
    }
  }

  // consulta Especialidad
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
  consultaEspecialidadResponse(res: any) {
    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.especialidadList = res
      console.log(this.especialidadList)

      this.relacion(2)
    }
  }

  creaClinicaEspecialidadClick(){
    this.creaClinicaEspecialidadBandera = true
  }

  //Creacion de clinica especialidad
  formularioCreacion2(){
    let formularioValido: any = document.getElementById("createForm2");
    if (formularioValido.reportValidity()) {
      this.crearClinicaEspecialidad(this.creaClinicaEspecialidad).subscribe(
        (respuesta: any) => this.crearClinicaEspecialidadResponse(respuesta)
      )
    }
  }

  // Crear clinica especialidad
  crearClinicaEspecialidad(clinicaEspecialidad: any) {
    console.log("Creacion de clinica especialidad")

    clinicaEspecialidad.clinicaIdClinica = this.clinicaSelect.idclinica

    console.log(clinicaEspecialidad)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/clinicaEspecialidad/crea", clinicaEspecialidad, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  crearClinicaEspecialidadResponse(res: any) {
    console.log(res + " aqui va el res ")

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok

      res = JSON.parse(JSON.stringify(res))
      console.log(res)

      alert("Se agrego la especialidad")

      this.creaClinicaEspecialidadBandera = false;

    }
  }
}
