import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-especialistas',
  templateUrl: './especialistas.component.html',
  styleUrls: ['./especialistas.component.css']
})
export class EspecialistasComponent implements OnInit {

  // variables
  consul: boolean = true
  crea: boolean = false
  elim: boolean= false
  busca: boolean = false

  constructor() {}

  ngOnInit(): void {
  }

  // menus de pantalla
  menu(x:any){
    this.consul = false;
    this.crea =  false
    this.elim = false

    switch (x){
      case 1: this.consul = true; break;
      case 2: this.crea = true; break;
      case 3: this.elim = true; break;
    }
  }

}
