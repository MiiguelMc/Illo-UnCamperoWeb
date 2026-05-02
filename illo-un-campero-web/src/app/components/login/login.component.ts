import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  emailError = '';
  passwordError = '';
  infoMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    if (this.route.snapshot.queryParams['sinVerificar']) {
      this.infoMessage = 'Verifica tu correo electrónico antes de continuar. Revisa tu bandeja de entrada.';
    }
  }

  async onLogin() {
    this.emailError = '';
    this.passwordError = '';
    this.infoMessage = '';

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.email)) {
      this.emailError = 'Introduce un correo válido (ejemplo@correo.com)';
      return;
    }

    try {
      const credenciales = await this.authService.login(this.email, this.password);
      if (!credenciales.user.emailVerified) {
        await this.authService.logout();
        this.infoMessage = 'Verifica tu correo electrónico antes de continuar. Revisa tu bandeja de entrada.';
        return;
      }
      this.router.navigate(['/restaurantes']);
    } catch (error: any) {
      this.password = '';
      this.passwordError = 'Credenciales incorrectas. Revisa tu correo y contraseña.';
    }
  }
}