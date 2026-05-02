import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent implements OnInit {
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
    password: '',
    generico: ''
  };

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.authService.user$.pipe(take(1)).subscribe(user => {
      if (user) this.router.navigate(['/restaurantes']);
    });
  }

  async onRegister() {
    this.errores = {
      nombre: '',
      apellidos: '',
      telefono: '',
      email: '',
      password: '',
      generico: ''
    };
    let hayErrores = false;

    if (!this.usuario.nombre.trim()) {
      this.errores.nombre = 'REGISTRO.ERR_NOMBRE';
      hayErrores = true;
    }
    if (!this.usuario.apellidos.trim()) {
      this.errores.apellidos = 'REGISTRO.ERR_APELLIDOS';
      hayErrores = true;
    }

    const telPattern = /^[0-9]{9}$/;
    if (!telPattern.test(this.usuario.telefono)) {
      this.errores.telefono = 'REGISTRO.ERR_TELEFONO';
      hayErrores = true;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.usuario.email)) {
      this.errores.email = 'REGISTRO.ERR_EMAIL';
      hayErrores = true;
    }

    if (this.usuario.password.length < 8) {
      this.errores.password = 'REGISTRO.ERR_PASSWORD';
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
        this.errores.email = 'REGISTRO.ERR_DUPLICADO';
      } else {
        this.errores.generico = 'REGISTRO.ERR_GENERIC';
      }
    }
  }
}
