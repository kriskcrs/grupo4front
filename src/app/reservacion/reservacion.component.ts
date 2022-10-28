import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reservacion',
  templateUrl: './reservacion.component.html',
  styleUrls: ['./reservacion.component.css']
})
export class ReservacionComponent implements OnInit {

  //variables
  departamentoList:any = []
  municipioList:any =  []
  clinicaList: any = []
  clinicaEspecialidadList:any = []
  especialidadList:any = []
  clinicaEspecialidadRelacionadaList:any = []
  clinicaListSede: any = []
  sedesList: any = []
  terapiaList:any = []
  terapiaListAgregar:any = []
  especialistaList:any = []
  clinica: any = {}
  horarioList:any = []
  reservacionList:any = []
  reservacion:any = {}
  sede:any
  especialidad:any
  usuario:any = {}
  departamento:any
  municipio:any
  terapia:any = {}
  tipoPago:any
  tipoPagoList:any = []
  estadoList:any = []
  reservacionListCompleto:any = []

  //calendario
  fecha: NgbDateStruct | undefined;

  // modal
  closeResult = '';

  // banderas
  consul: boolean = true
  crea: boolean = false
  elim: boolean = false
  busca: boolean = false
  agregaTerapiaBandera:boolean = false
  agregarTerapiaDeshabilitado:boolean = true

  constructor(private http: HttpClient, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.consultaR()
    this.usuario = localStorage.getItem("user")
    this.usuario = JSON.parse(this.usuario)
  }

  // menus de pantalla
  menu(x: any) {
    this.consul = false;
    this.crea = false
    this.elim = false

    switch (x) {
      case 1:
        this.consul = true;
        this.consultaR();
        break;
      case 2:
        this.crea = true;
        this.agregaTerapiaBandera = false;
        this.terapiaListAgregar = []
        this.reservacion = {}
        this.departamento = 0
        this.sede = 0
        this.municipio = 0
        this.catalogos()
        break;
      case 3:
        this.elim = true;
        break;
    }
  }


  //consulta reservacion
  consultaR() {
    this.consultaReservacion().subscribe(
      (respuesta: any) => this.consultaReservacionResponse(respuesta)
    )
    this.consultaHorario().subscribe(
      (respuesta: any) => this.consultaHorarioResponse(respuesta)
    )
    this.consultaEstado().subscribe(
      (respuesta: any) => this.consultaEstadoResponse(respuesta)
    )

    setTimeout(() => {
        this.relacionReservacion()
      },
      350);
  }

  //Consulta Reservacion
  consultaReservacion() {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/reservacion/consulta", httpOptions).pipe(
      catchError(e => "e")
    )
  }
  consultaReservacionResponse(res: any) {
    console.log("res = " + res)

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.reservacionList = res
      console.log(this.reservacionList)
    }
  }
  relacionReservacion(){
    this.reservacionListCompleto = []
    for (let reservacion of this.reservacionList){
      for(let horario of this.horarioList){
        if(reservacion.horarioIdHorario == horario.idHorario){
          reservacion.horario = horario.horario
        }
      }
      for(let estado of this.estadoList){
        if(reservacion.estadoIdEstado == estado.idEstado){
          reservacion.nombreEstado = estado.nombreEstado
        }
      }
      this.reservacionListCompleto.push(reservacion)
    }
  }

  //Consulta Estados
  consultaEstado() {
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
  consultaEstadoResponse(res: any) {
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

  //Catalogos
  catalogos(){
    this.consultaHorario().subscribe(
      (respuesta: any) => this.consultaHorarioResponse(respuesta)
    )
    this.consultaDepartamento().subscribe(
      (respuesta: any) => this.consultaDepartamentoResponse(respuesta)
    )
    this.consultaTipoPago().subscribe(
      (respuesta: any) => this.consultaTipoPagoResponse(respuesta)
    )

  }

  //Consulta Horario
  consultaHorario() {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/horario/consulta", httpOptions).pipe(
      catchError(e => "e")
    )
  }
  consultaHorarioResponse(res: any) {
    console.log("res = " + res)

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.horarioList = res
      console.log(this.horarioList)
    }
  }

  //consulta Departamento
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

  //Consulta Tipo Pago
  consultaTipoPago() {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/tipoPago/consulta", httpOptions).pipe(
      catchError(e => "e")
    )
  }
  consultaTipoPagoResponse(res: any) {
    console.log("res = " + res)

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.tipoPagoList = res
      console.log(this.tipoPagoList)
    }
  }

  //consulta municipio
  buscaMuni(){
    this.municipioList = []
    this.consultaMunicipio(this.departamento).subscribe(
      (respuesta: any) => this.consultaMunicipioResponse(respuesta)
    )
  }
  consultaMunicipio(id: number) {
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
    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.municipioList = res
      console.log(this.municipioList)
      console.log("termino response")
    }
  }

  //consulta Sede
  buscaSede(){
    this.sedesList = []
    this.consultaSedes(this.municipio).subscribe(
      (respuesta: any) => this.consultaSedesResponse(respuesta)
    )
  }
  consultaSedes(id:any) {
    console.log(id)
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/sede/consulta/" + id, httpOptions).pipe(
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
    }
  }

  // consulta terapias
  buscaTerapia(){
    this.terapiaList = []
    this.consultaTerapia().subscribe(
      (respuesta: any) => this.consultaTerapiaResponse(respuesta)
    )
  }
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
  consultaTerapiaResponse(res: any) {
    console.log("res = " + res)

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.terapiaList = res
      console.log(this.terapiaList)
    }
  }

  agregaTerapiaBtn(){
    this.agregaTerapiaBandera = true
    this.buscaTerapia()
  }

  agregaTerapia(){
    let terapia = this.terapia
    for(let terapiaL of this.terapiaList){
      if(terapia.idTerapia == terapiaL.idTerapia){
        this.terapiaListAgregar.push(terapiaL)
      }
    }

    this.buscaClinicas()

    this.terapia = {}
    this.agregaTerapiaBandera = false
  }

  habilitaTerapia(){
    console.log(this.sede)
    if(this.sede > 0 && this.sede != "") {
      this.agregarTerapiaDeshabilitado = false
    }else{
      this.agregarTerapiaDeshabilitado = true
    }
  }

  // consulta Clinicas
  buscaClinicas(){
    this.clinicaList = []
    this.consultaClinica(this.sede, this.terapiaListAgregar).subscribe(
      (respuesta: any) => this.consultaClinicaResponse(respuesta)
    )
  }
  consultaClinica(id:number, terapiaList:any) {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/clinica/consulta/" + id, terapiaList, httpOptions).pipe(
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

  // consulta Clinica especialidad
  buscaClinicaEspecialidad(){
    this.clinicaEspecialidadList = []
    this.consultaClinicaEspecialidad(this.clinica).subscribe(
      (respuesta: any) => this.consultaClinicaEspecialidadResponse(respuesta)
    )
  }
  consultaClinicaEspecialidad(id:number) {
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
  consultaEspecialidadResponse(res: any) {
    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.especialidadList = res
      console.log(this.especialidadList)
      console.log("termino response")

      this.relacion();
    }
  }

  relacion(){
    this.clinicaEspecialidadRelacionadaList = []
    for (let clinicaEspecialidad of this.clinicaEspecialidadList){
      for (let especialidad of this.especialidadList){
        if(clinicaEspecialidad.especialidadIdEspecialidad == especialidad.idEspecialidad){
          clinicaEspecialidad.especialidad = especialidad.especialidad
        }
      }
      this.clinicaEspecialidadRelacionadaList.push(clinicaEspecialidad)
    }

    console.log("clinica especialidad")
    console.log(this.clinicaEspecialidadRelacionadaList)
  }

  // consulta especialistas
  buscaEspecialista(){
    let especialidadSelect:any = {}

    console.log(this.reservacion.clinicaEspecialidadIdClinicaEspecialidad)

    for(let clinicaEspecialidadRelacionado of this.clinicaEspecialidadRelacionadaList){
      if(clinicaEspecialidadRelacionado.idClinicaEspecialidad = this.reservacion.clinicaEspecialidadIdClinicaEspecialidad){
        especialidadSelect = clinicaEspecialidadRelacionado
      }
    }

    this.especialistaList = []
    console.log(especialidadSelect)

    this.consultaEspecialista(especialidadSelect.especialidadIdEspecialidad).subscribe(
      (respuesta: any) => this.consultaEspecialistasesponse(respuesta)
    )
  }
  consultaEspecialista(id:number) {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/especialista/consulta/" + id, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  consultaEspecialistasesponse(res: any) {
    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.especialistaList = res
      console.log(this.especialistaList)
      console.log("termino response")


    }
  }



  //Creacion de reservacion
  formularioCreacion(){

    console.clear()
    console.log(this.fecha)

    this.reservacion.fechaRerservacion = this.fecha?.year + "-" + this.fecha?.month + "-" + this.fecha?.day
    this.reservacion.clienteIdCliente = this.usuario.idCliente
    this.reservacion.estadoIdEstado = 1
    console.log(this.reservacion)

    let formularioValido: any = document.getElementById("createForm");
    if (formularioValido.reportValidity()) {
      this.crearReservacion(this.reservacion).subscribe(
        (respuesta: any) => this.crearReservacionResponse(respuesta)
      )
    }
  }

  // Crear Reservacion
  crearReservacion(reservacion: any) {

    console.log("Creacion de reservación")
    console.log(reservacion)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/reservacion/crea", reservacion, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  crearReservacionResponse(res: any) {
    console.log(res + " aqui va el res ")

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok

      this.crearTerapiaReservacion(res.idReservacion).subscribe(
        (respuesta: any) => this.crearTerapiaReservacionResponse(respuesta)
      )

      res = JSON.parse(JSON.stringify(res))
      console.log(res)
      alert("Se creo la reservación: " + res.idReservacion)
      this.consul = true
      this.crea = false
    }
  }

  // Crear terapia Reservacion
  crearTerapiaReservacion(idReservacion: any) {

    console.log("Creacion de reservación")
    console.log(idReservacion)
    console.log(this.terapiaListAgregar)
    console.log(JSON.stringify(this.terapiaListAgregar))
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/terapiaReservacion/crea/" + idReservacion, this.terapiaListAgregar, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  crearTerapiaReservacionResponse(res: any) {
    console.log(res + " aqui va el res ")

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok

      res = JSON.parse(JSON.stringify(res))
      console.log(res)

      this.crearFactura(res).subscribe(
        (respuesta: any) => this.crearFacturaResponse(respuesta)
      )


    }
  }

  // Crear factura
  crearFactura(terapiaReservacionList:any) {
    console.log("Creacion de factura")

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4043/factura/crea/" + this.tipoPago, terapiaReservacionList, httpOptions).pipe(
      catchError(e => "e")
    )
  }
  crearFacturaResponse(res: any) {
    console.log(res + " aqui va el res ")

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok

      res = JSON.parse(JSON.stringify(res))
      console.log(res)
    }
  }
}
