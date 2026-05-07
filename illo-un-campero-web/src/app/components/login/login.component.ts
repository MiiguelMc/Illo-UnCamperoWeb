import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  emailError = '';
  passwordError = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.authService.user$.pipe(take(1)).subscribe(user => {
      if (user) this.router.navigate(['/restaurantes']);
    });
  }

  async onLogin() {
    this.emailError = '';
    this.passwordError = '';

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.email)) {
      this.emailError = 'LOGIN.ERR_EMAIL';
      return;
    }

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/restaurantes']);
    } catch (error: any) {
      this.password = '';
      const code = error?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
        this.emailError = 'LOGIN.ERR_NOT_FOUND';
      } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        this.passwordError = 'LOGIN.ERR_CREDENCIALES';
      } else {
        this.passwordError = 'LOGIN.ERR_GENERIC';
      }
    }
  }
}
