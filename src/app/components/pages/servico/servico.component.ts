import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-servico',
  standalone: true,
  imports: [
    CommonModule, 
  ],
  templateUrl: './servico.component.html',
  styleUrl: './servico.component.css'
})
export class ServicoComponent {
    disabled: boolean[] = [false, true, true, true];

    habilitarBotao(index: number): void {
        if (index < this.disabled.length) {
            this.disabled[index] = false;
        }
    }
}
