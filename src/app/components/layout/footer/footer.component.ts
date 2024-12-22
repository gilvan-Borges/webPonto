import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  autenticado: boolean = false;

  ngOnInit() {
    
    var data = sessionStorage.getItem('usuario');
    if(data) {
      this.autenticado = true;
    }
  }

}