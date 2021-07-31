import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ExtractorsComponent } from './extractors/extractors.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'extractors', component: ExtractorsComponent },
];

@NgModule({
  declarations: [AppComponent, ExtractorsComponent],
  imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
