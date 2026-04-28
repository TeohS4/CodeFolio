import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service/auth-service';
import { LoginRequest } from '../../../core/interfaces/user.interface';
import { PAGES_IMPORTS } from '../../pages.imports';
import { AlertService } from '../../../core/services/alert-service/alert';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [...PAGES_IMPORTS],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {

  model: LoginRequest = {
    username: '',
    password: ''
  };

  constructor(
    private auth: AuthService,
    private alert: AlertService,
    private router: Router
  ) { }

  onLogin() {
    this.auth.login(this.model).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/home']);
      },
      error: () => {
        this.alert.error("Wrong username or password");
      }
    });
  }
}