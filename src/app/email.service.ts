import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl = 'http://localhost:3001/send-email'; // URL do seu backend onde o Nodemailer está rodando

  constructor(private http: HttpClient) {}

  // Método para enviar os dados do formulário para o backend
  sendEmail(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData, { responseType: 'text' });
 // Realiza a requisição HTTP POST para o backend
  }
}
