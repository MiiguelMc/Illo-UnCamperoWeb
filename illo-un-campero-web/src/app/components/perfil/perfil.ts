import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../../model/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: [{ value: '', disabled: true }], // El email no se edita
      telefono: ['', [Validators.required]],
      direccion: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user: Usuario | null) => {
      if (user) {
        this.usuario = user;
        this.profileForm.patchValue({
          nombre: user.nombre,
          email: user.email,
          telefono: user.telefono || '',
          direccion: user.direccion || ''
        });
      }
    });
  }

  guardarCambios(): void {
    if (this.profileForm.valid && this.usuario) {
      const datosActualizados: Usuario = {
        ...this.usuario,
        ...this.profileForm.getRawValue()
      };

      this.authService.updateUserData(this.usuario.uid, datosActualizados).subscribe({
        next: (res: any) => {
          console.log("✅ Perfil actualizado:", res);
          this.mensaje = "¡Perfil actualizado con éxito!";
          setTimeout(() => this.mensaje = '', 3000);
        },
        error: (err: any) => {
          console.error("❌ Error al actualizar:", err);
          this.mensaje = "Error al guardar: No se pudo actualizar el perfil.";
        }
      });
    } else {
      this.mensaje = "Por favor, rellena todos los campos correctamente.";
    }
  }

  cambiarPass(): void {
    if (this.usuario && this.usuario.email) {
      this.authService.sendPasswordReset(this.usuario.email)
        .then(() => {
          this.mensaje = "Se ha enviado un correo para cambiar tu contraseña.";
          setTimeout(() => this.mensaje = '', 5000);
        })
        .catch((error: any) => {
          console.error("Error al enviar reset:", error);
          this.mensaje = "Hubo un error al intentar enviar el correo.";
        });
    }
  }
}