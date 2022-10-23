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

  // modal
  closeResult = '';

  // cryp
  md5: any = new Md5()

  //constructores
  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {

    // consulta de facturas
    this.consultaFactura().subscribe(
      (respuesta: any) => this.consultaFacturaResponse(respuesta)
    )


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
    return this.http.get<any>("http://localhost:4043/Factura/consulta", httpOptions).pipe(
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
    return this.http.get<any>("http://localhost:4043/TipoPago/consulta", httpOptions).pipe(
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
      1000);

  }

  // consulta Detalle
  consultaDetalle(id: any) {
    console.log("Llamada al servicio")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4043/Factura/detalle/" + id, httpOptions).pipe(
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
}
