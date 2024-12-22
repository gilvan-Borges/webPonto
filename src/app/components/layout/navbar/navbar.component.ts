import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

      // Propriedades para controlar o estado do menu e do botão
      isMenuOpen: boolean = false;

      constructor() {}
    
      // Função para controlar a abertura e fechamento do menu
      controlMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
      }

  //atributos
  autenticado: boolean = false;
  nomeUsuario: string = '';


  //função executada quando o componente é carregado
  ngOnInit() {
    
    var data = sessionStorage.getItem('usuario');
    if(data) {
      this.autenticado = true;
      var usuario = JSON.parse(data);
      this.nomeUsuario = usuario.nome;
    }
  }


 
  //função para logout do usuário
  logout(){
    if(confirm('Deseja realmente sair do sistema?')){
      //apagar os dados da session storage
      sessionStorage.removeItem('usuario');
        //redirecionando para a pagina de login
      location.href= 'pages/usuarios/autenticar';
      location.reload();
    }
  }
}