import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../../model/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  profileForm: FormGroup;
  usuario: Usuario | null = null;
  mensaje: string = '';

  constructor() {
    this.profileForm = this.fb.group({
      nombre: ['', Validators.required],
      email: [{ value: '', disabled: true }], // El email no se edita
      telefono: [''],
      direccion: ['']
    });
  }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.usuario = user;
        this.profileForm.patchValue({
          nombre: user.nombre,
          email: user.email,
          // rellena aquí más campos si tu modelo 'Usuario' los tiene
        });
      }
    });
  }

  // En perfil.ts
guardarCambios() {
  if (this.profileForm.valid && this.usuario) {
    // Usamos getRawValue() para que incluya el email aunque esté disabled
    const datosActualizados = this.profileForm.getRawValue();

    this.authService.updateUserData(this.usuario.uid, datosActualizados).subscribe({
      next: (res) => {
        console.log("✅ Backend actualizado:", res);
        this.mensaje = "¡Perfil actualizado con éxito!";
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: (err) => {
        console.error("❌ Error 403 o similar:", err);
        this.mensaje = "Error al guardar: No tienes permisos o el servidor rechazó la petición.";
      }
    });
  }
}

  cambiarPass() {
    if (this.usuario && this.usuario.email) {
      this.authService.sendPasswordReset(this.usuario.email)
        .then(() => {
          this.mensaje = "Se ha enviado un correo a " + this.usuario?.email + " para cambiar tu contraseña.";
          
          // Limpiar el mensaje después de 5 segundos
          setTimeout(() => this.mensaje = '', 5000);
        })
        .catch((error) => {
          console.error("Error al enviar email de reset:", error);
          this.mensaje = "Hubo un error al intentar enviar el correo.";
        });
    }
  }

  
}