import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-autenticar-usuario',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './autenticar-usuario.component.html',
  styleUrl: './autenticar-usuario.component.css'
})
export class AutenticarUsuarioComponent {


  mensagemErro: string = '';


  constructor(
    private httpClient: HttpClient
  ) { }


  formulario = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(8)])
  });


  get f() {
    return this.formulario.controls;
  }


  autenticarUsuario() {
    this.httpClient.post('http://localhost:8093/api/login/autenticar', this.formulario.value)
      .subscribe({
        next: (data: any) => {
          
          sessionStorage.setItem('usuario', JSON.stringify(data));
          
          location.href = '/pages/dashboard';
        },
        error: (e) => {
          this.mensagemErro = e.error[0];
        }
      })
  }
}
