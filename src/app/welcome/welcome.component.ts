import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  login(){
    location.href="login";
  }

  images = ["saludsifre.com/wp-content/uploads/2016/04/masajes-terapeuticos-760x364.jpg",
    "www.figursan.com/regala-masajes-terapeuticos-durante-estas-navidades_img32692t1.jpg"
  ].map((n) => `https:${n}`);

}
