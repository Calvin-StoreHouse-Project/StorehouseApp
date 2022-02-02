import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchiveComponent } from './component/archive/archive.component';
import { CurrentComponent } from './component/current/current.component';
import { HomeComponent } from './component/home/home.component';
import { LayoutComponent } from './component/layout/layout.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'current', component: CurrentComponent },
  { path: 'archive', component: ArchiveComponent },
  { path: 'layout', component: LayoutComponent },

  // otherwise, redirect to home
  { path: '**', redirectTo:'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
