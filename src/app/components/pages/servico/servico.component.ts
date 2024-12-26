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

  horaServico: string = '--:--';
  horaAlmoco: string = '--:--';
  horaFimAlmoco: string = '--:--';
  horaFimServico: string = '--:--';

 dadosFuncionario = {id: "8e914aff-88e3-4d91-9e24-1281585f252f", name: "Gilvan Borges"}

  iniciarServico() {
    this.horaServico = this.getHoraAtual();
    this.btn1 = true;
    this.btn2 = false;
    this.httpClient.post('http://localhost:8095/api/ponto/entrada',this.dadosFuncionario)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.error('Erro ao carregar funcionários:', err);
        }
      });
  }

  iniciarAlmoco() {
    this.horaAlmoco = this.getHoraAtual();
    this.btn2 = true;
    this.btn3 = false;
  }

  fimAlmoco() {
    this.horaFimAlmoco = this.getHoraAtual();
    this.btn3 = true;
    this.btn4 = false;
  }

  fimServico() {
    this.horaFimServico = this.getHoraAtual();
    this.btn4 = true;
  }

  getHoraAtual(): string {
    const agora = new Date();
    return agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}