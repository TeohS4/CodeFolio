import { ChangeDetectorRef, Component, inject, viewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatExpansionModule, MatExpansionPanel, MatExpansionPanelTitle } from '@angular/material/expansion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, shareReplay } from 'rxjs';
import { AuthService } from '../../../core/services/auth-service/auth-service';
import { AlertService } from '../../../core/services/alert-service/alert';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIcon,
    MatExpansionModule,
    MatButtonModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  currentTime: string = '';
  intervalId: any;
  constructor(
    private auth: AuthService,
    private router: Router,
    private alert: AlertService,
    private cdr: ChangeDetectorRef
  ) { }

  private breakpointObserver = inject(BreakpointObserver);

  ngOnInit() {
    this.updateTime();
    this.intervalId = setInterval(() => {
      this.updateTime();
      this.cdr.detectChanges();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }

  // Create a signal that is true if we are on a mobile device
  isMobile = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(result => result.matches),
      shareReplay()
    ),
    { initialValue: false }
  );

  sidenav = viewChild.required(MatSidenav);

  toggleSidenav() {
    this.sidenav().toggle();
  }

  logout() {
    this.auth.logout();
    this.alert.success('Logged out', 'See you again!');
    this.router.navigate(['/login']);
  }
}