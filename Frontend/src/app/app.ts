import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Sidebar } from './shared/components/sidebar/sidebar';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('code-folio');
}