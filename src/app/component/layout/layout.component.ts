import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RedirectSnackBarComponent } from '../redirect-snack-bar/redirect-snack-bar.component';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  durationInSeconds: number = 3;

  constructor(public authService: AuthService, public router: Router, public snackbar: MatSnackBar) {
    if(!this.authService.loggedIn) { this.router.navigate(['/home']); this.openRedirectSnackBar(); }
  }

  ngOnInit(): void {
  }

  openRedirectSnackBar() {
    this.snackbar.openFromComponent(RedirectSnackBarComponent, {
      duration: this.durationInSeconds * 1000
    })
  }

}
