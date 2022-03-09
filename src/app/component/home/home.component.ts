import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginData } from 'src/app/core/interfaces/login-data.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  username: string = '';
  password: string = '';

  @Output() formData: EventEmitter<{
    email: string;
    password: string;
  }> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  // login(loginData: LoginData) {
  //   this.authService.login(loginData).then(() => {
  //     this.router.navigate(['/current']).catch((e) => {
  //       console.log(e.message);
  //     })
  //   })
  // }

}
