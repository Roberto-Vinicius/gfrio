import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-contato',
  templateUrl: './form-contato.component.html',
  styleUrl: './form-contato.component.css'
})

export class FormContatoComponent {
  contactForm: FormGroup;  // Cria o FormGroup para gerenciar os controles do formulário.

  constructor(private fb: FormBuilder) {
    // Inicializa o FormGroup com os controles de formulário e validações.
    this.contactForm = this.fb.group({
      name: ['', Validators.required],  // Campo 'name' é obrigatório.
      email: ['', [Validators.required, Validators.email]],  // Campo 'email' é obrigatório e deve ser um email válido.
      contact: ['', Validators.required],  // Campo 'contact' é obrigatório.
      query: ['', Validators.required]  // Campo 'query' é obrigatório.
    });
  }

  onSubmit() {
      // Verifica se o formulário é válido antes de prosseguir.
    if (this.contactForm.valid) {
      // Captura os valores dos campos do formulário.
      const formData = this.contactForm.value;

      // Cria um objeto FormData para enviar os dados do formulário
      const formDataObject = new FormData();
      formDataObject.append('Nome do cliente', formData.name);
      formDataObject.append('Email', formData.email);
      formDataObject.append('Contato', formData.contact);
      formDataObject.append('Mensagem', formData.query);

      // Envia os dados do formulário para o FormSubmit
      fetch('https://formsubmit.co/pgo044260@gmail.com', {
        method: 'POST',
        body: formDataObject
      })
      .then(response => {
        if (response.ok) {
          console.log('Formulário enviado com sucesso!');
          // Aqui você pode adicionar lógica para mostrar uma mensagem de sucesso ao usuário
        } else {
          console.error('Erro ao enviar o formulário.');
          // Aqui você pode adicionar lógica para mostrar uma mensagem de erro ao usuário
        }
      })
      .catch(error => {
        console.error('Erro:', error);
        // Aqui você pode adicionar lógica para mostrar uma mensagem de erro ao usuário
      });
    }
  }
}