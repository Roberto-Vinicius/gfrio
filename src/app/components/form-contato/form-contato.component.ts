import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Importa o HttpClient para requisições HTTP
import { EmailService } from '../../email.service';

@Component({
  selector: 'app-form-contato',
  templateUrl: './form-contato.component.html',
  styleUrls: ['./form-contato.component.css']
})
export class FormContatoComponent {
  contatoForm: FormGroup;
  enviado: boolean = false; // Para controle de sucesso no envio
  erroEnvio: boolean = false; // Para controle de erro no envio

  constructor(
    private formBuilder: FormBuilder,
    private emailService: EmailService 
  ) {
    this.contatoForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      contato: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      mensagem: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contatoForm.invalid) {
      console.error('Formulário inválido!');
      return;
    }

    // Enviar os dados para o backend
    this.emailService.sendEmail(this.contatoForm.value).subscribe(
      (response: any) => {
        this.enviado = true; // Sucesso no envio
        this.erroEnvio = false; // Limpa o erro se houver
        console.log(response);
      },
      (error: any) => {
        this.enviado = false;
        this.erroEnvio = true; 
        console.error(error);
      }
    );
    // Limpa o form
    this.contatoForm.reset();
  }
}