import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from '../menu-item';

@Component({
  selector: 'app-responsive-toolbar',
  templateUrl: './responsive-toolbar.component.html',
  styleUrls: ['./responsive-toolbar.component.scss']
})
export class ResponsiveToolbarComponent implements OnInit {
  menuItems: MenuItem[] = [
    {
      label: 'Home',
      routerLink: "/home",
      showOnDesktop: true,
      showOnMobile: true,
      showOnTablet: true
    },
    {
      label: 'Current',
      routerLink: "/current",
      showOnDesktop: true,
      showOnMobile: false,
      showOnTablet: true
    },
    {
      label: 'Archive',
      routerLink: "/archive",
      showOnDesktop: true,
      showOnMobile: false,
      showOnTablet: true
    },
    {
      label: 'Layout',
      routerLink: "/layout",
      showOnDesktop: true,
      showOnMobile: false,
      showOnTablet: true
    },
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

}
