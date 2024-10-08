import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SobreComponent } from './components/pages/sobre/sobre.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ServicoComponent } from './components/pages/servico/servico.component';
import { FormContatoComponent } from './components/form-contato/form-contato.component';
import { ClientesComponent } from './components/pages/clientes/clientes.component';
import { FullPagesComponent } from './components/pages/full-pages/full-pages.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SobreComponent,
    FormContatoComponent,
    ServicoComponent,
    ClientesComponent,
    FullPagesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
