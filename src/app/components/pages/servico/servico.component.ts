import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
  ],
  templateUrl: './servico.component.html',
  styleUrl: './servico.component.css'
})
export class ServicoComponent implements OnInit {

  constructor ( private httpClient: HttpClient ){ }

  btn1: boolean = false;
  btn2: boolean = true;
  btn3: boolean = true;
  btn4: boolean = true;

  usuario: any = {};  // Armazena dados do usuário

  ngOnInit() {
    this.apiLogin();
  }

 
  apiLogin() {
    const usuarioSession = sessionStorage.getItem('usuario');

    if (usuarioSession) {
      this.usuario = JSON.parse(usuarioSession);  // Converte string JSON para objeto
    } else {
      this.usuario = { nome: 'Visitante' };  // Valor padrão se não encontrar dados
    }
  }

  iniciarServico() {
    this.btn2 = false;
  }

  iniciarAlmoco() {
    this.btn3 = false;
  }
  
  fimAlmoco() {
    this.btn4 = false;
  }

  fimServico() {
    // Lógica para finalizar o serviço
  }
}
