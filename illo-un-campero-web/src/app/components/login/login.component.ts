import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  emailError = '';
  passwordError = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  async onLogin() {
    this.emailError = '';
    this.passwordError = '';

    // VALIDACIÓN DE FORMATO DE CORREO (Regex)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailPattern.test(this.email)) {
      this.emailError = 'Introduce un correo válido (ejemplo@correo.com)';
      return;
    }

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/restaurantes']);
    } catch (error: any) {
      this.password = ''; // Limpiamos contraseña en caso de fallo
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        this.passwordError = 'Contraseña incorrecta o usuario no encontrado.';
      } else if (error.code === 'auth/user-not-found') {
        this.emailError = 'Este correo no está registrado.';
      } else {
        this.emailError = 'Error al iniciar sesión. Revisa tus datos.';
      }
    }
  }
}