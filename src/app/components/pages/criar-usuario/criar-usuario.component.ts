import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-criar-usuario',
  standalone: true,
  imports: [
    RouterLink, //navegação em rotas
    CommonModule, //diretivas básicas do angular
    FormsModule, //formulários reativos
    ReactiveFormsModule //formulários reativos
  ],
  templateUrl: './criar-usuario.component.html',
  styleUrl: './criar-usuario.component.css'
})
export class CriarUsuarioComponent {

  //atributos
  mensagemSucesso: String = '';
  mensagemErro: String = '';

  //metodo construtor (injeção de dependência)
  constructor(
    private httpClient: HttpClient
  ){  }


  //construindo a estrutura do formulário
  formulario = new FormGroup({
    nome : new FormControl('', [Validators.required, Validators.minLength(8)]),
    cargo: new FormControl('', [Validators.required]),
    email : new FormControl('', [Validators.required, Validators.email]),
    senha : new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/)]),
    senhaConfirmacao : new FormControl('', [Validators.required])
  },
  { validators: this.senhaConfirmacaoValidator  }
  );  


  senhaConfirmacaoValidator(abstractControl: AbstractControl) {
    let senha = abstractControl.get('senha')?.value;
    let senhaConfirmacao = abstractControl.get('senhaConfirmacao')?.value;
    if (senhaConfirmacao.length > 0 && senhaConfirmacao != senha) {
      abstractControl.get('senhaConfirmacao')?.setErrors({
        matchPassword: true,
      });
    }
    return null;
  }

  //
  get f() {
    return this.formulario.controls;
  }

  criarUsuario() {

  this.mensagemSucesso = '';
  this.mensagemErro = '';

    this.httpClient.post('http://localhost:8096/api/login/cadastrar', this.formulario.value)
      .subscribe({
        next: (data: any) =>{
          this.mensagemSucesso = data.mensagem;
          this.formulario.reset();
        },
        error: (e) =>{
          this.mensagemErro = e.error[0];
        }
      })
  }
}