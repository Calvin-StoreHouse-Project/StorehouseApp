import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { windowToggle } from 'rxjs';

// const firebaseApp = initializeApp({
//   apiKey: "AIzaSyD7Fik7QaBpMfGSuKe-B_o68lPbOXpzTCk",
//   authDomain: "storehouse-eb19b.firebaseapp.com",
//   projectId: "storehouse-eb19b",
//   storageBucket: "storehouse-eb19b.appspot.com",
//   messagingSenderId: "659342098594",
//   appId: "1:659342098594:web:f0cacf47c316f601c317fb",
//   measurementId: "G-YP05SREWH6"
// });

// const auth = getAuth(firebaseApp);
// connectAuthEmulator(auth, "http://localhost:9099");


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // source code on password visibility toggle
  // https://stackblitz.com/edit/angular-material-password-visibility-toggle?file=src%2Fapp%2Fapp.component.ts
  hide: boolean = true;

  email: any = '';
  password: string = '';
  error_message: boolean = false;
  isLoggedInUI: boolean = false;

  // @Output() formData: EventEmitter<{
  //   email: string;
  //   password: string;
  // }> = new EventEmitter();

  constructor(public authService: AuthService, public router: Router) {
    if(this.authService.loggedIn) {
      this.isLoggedInUI = true;
      console.log(this.authService.user);
      try { this.email = this.authService.user.email; }
      catch(e) { console.log(e); }
    }

  }

  ngOnInit(): void {
  }

  handleEnter(event: any) {
    // document.getElementById("password")?.addEventListener("keyup", function(e) {
      if(event.keyCode === 13) {
        console.log("1")
        document.getElementById("signin")?.click();
      }
    // })
  }

  async login() {

    let email = this.email;
    let password = this.password;

    try {
      await this.authService.login(email, password).then(() => {
        this.router.navigate(['/current']);
      });
      this.email = this.authService.getUser()?.email;
      this.isLoggedInUI = true;
    } catch(error) {
      this.error_message = true;
      console.log(error);
    }
  }

  async logout() {
    await this.authService.logout();
    this.isLoggedInUI = false;
    this.error_message = false;

    // empty credentials
    this.email = '';
    this.password = ''
  }

}
