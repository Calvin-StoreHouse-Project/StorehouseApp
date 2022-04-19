import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UpdateSnackBarComponent } from './component/update-snack-bar/update-snack-bar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { AddSnackBarComponent } from './component/add-snack-bar/add-snack-bar.component';
import { AuthService } from './auth/auth.service';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { RedirectSnackBarComponent } from './component/redirect-snack-bar/redirect-snack-bar.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ResponsiveToolbarComponent } from './responsive-toolbar/responsive-toolbar.component';
import { MatMenuModule } from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';


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
    HomeComponent,
    UpdateSnackBarComponent,
    AddSnackBarComponent,
    RedirectSnackBarComponent,
    ResponsiveToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSortModule,
    provideAuth(() => getAuth()),
    MatSlideToggleModule,
    FlexLayoutModule,
    MatMenuModule,
    MatDividerModule,
  ],
  providers: [MatNativeDateModule, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
