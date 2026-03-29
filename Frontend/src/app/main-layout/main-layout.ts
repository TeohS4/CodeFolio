import { Component, signal } from '@angular/core';
import { Footer } from '../shared/components/footer/footer';
import { Sidebar } from '../shared/components/sidebar/sidebar';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [
    MatSidenavModule,
    MatListModule,
    Footer,
    RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {

}
