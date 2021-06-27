import { Component } from '@angular/core';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {


  disconnect(){
    //vide le session storage a la deconnection de l'utilisateur 
    sessionStorage.clear()
  }
}
