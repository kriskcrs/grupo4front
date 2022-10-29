import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Md5} from 'ts-md5';
import * as XLSX from 'xlsx';
// modal
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  // variables
  menuList:any = []
  permisosList:any = []
  facturasList:any = []
  tipoPagoList:any = []
  tipoPagoFacturaList:any = []
  facturaDetalle: any = []
  detalleFactura: any = []
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

    // consulta de facturas
    this.consultaFactura().subscribe(
      (respuesta: any) => this.consultaFacturaResponse(respuesta)
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
        this.consul = true; this.consultaFactura().subscribe(
        (respuesta: any) => this.consultaFacturaResponse(respuesta)
      );
        break;
      case 2: this.crea = true; break;
      case 3: this.elim = true; break;
    }
  }

  // consulta facturas
  consultaFactura() {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/factura/consulta", httpOptions).pipe(
      catchError(e => "e")
    )
  }

  //Respuesta para la consulta de los factura
  consultaFacturaResponse(res: any) {
    console.log("res = " + res)

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.facturasList = res

      //Llamada a los tipos de pagi
      this.consultaTipoDePago().subscribe(
        (respuesta: any) => this.consultaTipoDePagoResponse(respuesta)
      )

    }
  }

  // consulta tipos de pago
  consultaTipoDePago() {
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

  //Respuesta para la consulta de los factura
  consultaTipoDePagoResponse(res: any) {
    console.log("res = " + res)

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.tipoPagoList = res
      this.tipoDePago()
    }
  }

  //Seteo de tipo de pago
  tipoDePago() {
    console.log(this.tipoPagoList)
    this.tipoPagoFacturaList = []

    for(let factura of this.facturasList){
      for(let tipoPago of this.tipoPagoList){
        if(factura.facturaTipoPagoIdFacturaTipoPago = tipoPago.idTipoPago){
          factura.tipoPago = tipoPago.tipoPago
          break;
        }
      }
      this.tipoPagoFacturaList.push(factura)
    }
    console.log(this.tipoPagoFacturaList)
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

  // Consultas a detalles de la factura
  detallesFactura(content:any, factura: any){
    this.facturaDetalle = factura
    console.log(this.facturaDetalle)

    // consulta de detalle
    this.consultaDetalle(factura.detalleFacturaList[0].idDetalleFactura).subscribe(
      (respuesta: any) => this.consultaDetalleResponse(respuesta)
    )

    setTimeout(() => {
        this.openXl(content)
      },
      700);

  }

  // consulta Detalle
  consultaDetalle(id: any) {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/factura/detalle/" + id, httpOptions).pipe(
      catchError(e => "e")
    )
  }

  //Respuesta para la consulta del detalle
  consultaDetalleResponse(res: any) {

    if (res == "e" || res == null) {
      alert("No hay comunicación con el servidor!!")
    } else if (res != null) {
      // ok
      res = JSON.parse(JSON.stringify(res))
      this.detalleFactura = res
      console.log(this.detalleFactura)
      console.log("termino response")
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
}
