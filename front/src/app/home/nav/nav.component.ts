import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  private router:Router;
  constructor(router: Router) {
    this.router = router;
   }

  ngOnInit(): void {
  }
  logout() {

    this.router.navigate(['/signup']);
  }
}
