import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HomeComponent } from './component/home/home.component';
import { CurrentComponent } from './component/current/current.component';
import { ArchiveComponent } from './component/archive/archive.component';
import { LayoutComponent } from './component/layout/layout.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    AppComponent,
    CurrentComponent,
    ArchiveComponent,
    LayoutComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
