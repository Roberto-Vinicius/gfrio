import { Component } from '@angular/core';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {
  clientes = [
    {
      titulo: 'Cliente 1',
      imagem: 'assets/aguia.png'
    },
    {
      titulo: 'Cliente 2',
      imagem: 'assets/fenix.png' 
    },
    {
      titulo: 'Cliente 3',
      imagem: 'assets/fogo.png'
    },
    {
      titulo: 'Cliente 4',
      imagem: 'assets/peixe.png'
    },
    {
      titulo: 'Cliente 5',
      imagem: 'assets/tigre.png'
    },
  ];
}
