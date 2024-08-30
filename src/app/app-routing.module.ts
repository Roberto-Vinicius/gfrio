import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullPagesComponent } from './components/pages/full-pages/full-pages.component';
const routes: Routes = [
  { path: '', component: FullPagesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
