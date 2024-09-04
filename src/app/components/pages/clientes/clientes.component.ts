import { Component } from '@angular/core';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {
  clientes = [
    {
      titulo: 'Colégio e Curso',
      imagem: 'assets/clientes/over.png',
      descricao: ""
    },
    {
      titulo: 'Grupo Sal e Brasa',
      imagem: 'assets/clientes/logo-sal-e-brasa.png',
      descricao: ""
    },
    {
      titulo: 'Super Fácil',
      imagem: 'assets/clientes/logo_superfacil.png',
      descricao: "Unidade Emaús"
    },
    {
      titulo: 'Queiros Atacado',
      imagem: 'assets/clientes/queiros_atacado.png',
      descricao: "Unidade São Gonçalo do Amarante"
    },
    {
      titulo: 'Grupo Ster Bom',
      imagem: 'assets/clientes/ster_bom.jpg',
      descricao: ""
    },
    {
      titulo: 'Grupo Multigiro',
      imagem: 'assets/clientes/multigiro.png',
      descricao: ""
    },
    {
      titulo: 'Bom Frio',
      imagem: 'assets/clientes/bom_frio.png',
      descricao: "Shopping Cidade Verde"
    },
  ];
}
