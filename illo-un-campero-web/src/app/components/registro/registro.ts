import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  usuario = {
    nombre: '',
    apellidos: '',
    telefono: '',
    email: '',
    password: ''
  };

  errores = {
    nombre: '',
    apellidos: '',
    telefono: '',
    email: '',
    password: ''
  };

  private authService = inject(AuthService);
  private router = inject(Router);

  async onRegister() {
    this.errores = { nombre: '', apellidos: '', telefono: '', email: '', password: '' };
    let hayErrores = false;

    if (!this.usuario.nombre.trim()) {
      this.errores.nombre = 'El nombre es obligatorio.';
      hayErrores = true;
    }
    if (!this.usuario.apellidos.trim()) {
      this.errores.apellidos = 'Los apellidos son obligatorios.';
      hayErrores = true;
    }

    const telPattern = /^[0-9]{9}$/;
    if (!telPattern.test(this.usuario.telefono)) {
      this.errores.telefono = 'El teléfono debe tener 9 dígitos numéricos.';
      hayErrores = true;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.usuario.email)) {
      this.errores.email = 'Introduce un correo electrónico válido.';
      hayErrores = true;
    }

    if (this.usuario.password.length < 6) {
      this.errores.password = 'La contraseña debe tener al menos 6 caracteres.';
      this.usuario.password = '';
      hayErrores = true;
    }

    if (hayErrores) return;

    try {
      await this.authService.register(
        this.usuario.email,
        this.usuario.password,
        {
          nombre: this.usuario.nombre,
          apellidos: this.usuario.apellidos,
          telefono: this.usuario.telefono
        }
      );
      this.router.navigate(['/restaurantes']);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.errores.email = 'Este correo ya está registrado.';
      } else {
        alert('Error inesperado: ' + error.message);
      }
    }
  }
}
