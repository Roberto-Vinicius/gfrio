import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.css'] // Corrigido de `styleUrl` para `styleUrls`
})
export class SobreComponent {

  constructor(private http: HttpClient) {}

  downloadPdf() {
    const pdfUrl = 'assets/portifolio_gfrio.pdf'; // Caminho relativo ao PDF dentro da pasta assets
    const pdfName = 'portifolio_gfrio.pdf'; // Nome que o arquivo terá ao ser baixado

    this.http.get(pdfUrl, { responseType: 'blob' }).subscribe((fileBlob) => {
      const blob = new Blob([fileBlob], { type: 'application/pdf' });
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = pdfName;
      link.click();
    });
  }
}
