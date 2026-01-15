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
  // Modelo de datos
  usuario = {
    nombre: '',
    apellidos: '',
    telefono: '',
    email: '',
    password: ''
  };

  // Objeto para almacenar los mensajes de error por campo
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
    // 1. Limpiamos todos los errores antes de empezar la validación
    this.errores = { nombre: '', apellidos: '', telefono: '', email: '', password: '' };
    let hayErrores = false;

    // --- VALIDACIONES ---

    // Nombre y Apellidos (Que no estén vacíos)
    if (!this.usuario.nombre.trim()) { this.errores.nombre = 'El nombre es obligatorio.'; hayErrores = true; }
    if (!this.usuario.apellidos.trim()) { this.errores.apellidos = 'Los apellidos son obligatorios.'; hayErrores = true; }

    // Teléfono (Exactamente 9 números)
    const telPattern = /^[0-9]{9}$/;
    if (!telPattern.test(this.usuario.telefono)) {
      this.errores.telefono = 'El teléfono debe tener 9 dígitos numéricos.';
      hayErrores = true;
    }

    // Email (Formato válido)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.usuario.email)) {
      this.errores.email = 'Introduce un correo electrónico válido.';
      hayErrores = true;
    }

    // Contraseña (Mínimo 6 caracteres para Firebase)
    if (this.usuario.password.length < 6) {
      this.errores.password = 'La contraseña debe tener al menos 6 caracteres.';
      this.usuario.password = ''; // Limpiamos el campo por seguridad
      hayErrores = true;
    }

    // Si hay algún error, no continuamos
    if (hayErrores) return;

    // 2. Si todo es válido, procedemos al registro en Firebase
    try {
      await this.authService.register(this.usuario);
      alert('¡Cuenta creada con éxito! Bienvenido a Illo Un Campero.');
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