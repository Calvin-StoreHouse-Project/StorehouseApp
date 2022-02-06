import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { firebaseConfig } from './credentials';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

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

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7Fik7QaBpMfGSuKe-B_o68lPbOXpzTCk",
  authDomain: "storehouse-eb19b.firebaseapp.com",
  projectId: "storehouse-eb19b",
  storageBucket: "storehouse-eb19b.appspot.com",
  messagingSenderId: "659342098594",
  appId: "1:659342098594:web:f0cacf47c316f601c317fb",
  measurementId: "G-YP05SREWH6"
};

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
    // AngularFireModule.initializeApp(firebaseConfig),
    // AngularFirestoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
