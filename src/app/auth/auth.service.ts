import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import firebase  from  'firebase/compat/app';
import { AngularFireAuth } from  '@angular/fire/compat/auth';
import { getAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: firebase.User;

  constructor(public afAuth: AngularFireAuth, public router: Router) {
    this.afAuth.authState.subscribe(user => {
      if (user){
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', '');
      }
    })
  }

  // source: https://www.techiediaries.com/angular-firebase/angular-9-firebase-authentication-email-google-and-password/

  async login(email: string, password: string) {
    await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async logout(){
    await this.afAuth.signOut();
    localStorage.removeItem('user');
  }

  get loggedIn(): boolean {
    let user: any = '';
    let data = localStorage.getItem('user');
    if (data) {user = JSON.parse(data)} else {user = null;}
    return user !== null;
  }

  getUser() {
    console.log(getAuth());
    return getAuth().currentUser;
  }

}
