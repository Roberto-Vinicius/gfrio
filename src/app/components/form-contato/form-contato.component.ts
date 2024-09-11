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

  constructor(
    private formBuilder: FormBuilder,
    private emailService: EmailService // Injeção do serviço de e-mail
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
        console.log('E-mail enviado com sucesso!', response);
      },
      (error: any) => {
        console.error('Erro ao enviar o e-mail:', error);
      }
    );
  }
}