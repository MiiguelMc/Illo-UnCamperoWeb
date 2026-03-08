import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {

  constructor(public router: Router) {}

  comprobarPedido() {
    // Comprobamos si hay sesión (token)
    const token = localStorage.getItem('token');

    if (token) {
      // Si está logueado, vamos a la página
      this.router.navigate(['/tu-pedido']);
    } else {
      // Pop-up con los estilos de tu web
      Swal.fire({
        title: '<strong>¿Aún no te has registrado?</strong>',
        text: 'Para gestionar tus pedidos echa un vistazo a nuestra zona de registro.',
        icon: 'info',
        iconColor: '#f39200', // El naranja de tu menú
        showCloseButton: true, // La X en la esquina
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Registrarse',
        cancelButtonText: 'Ahora no',
        buttonsStyling: false, // Desactivamos el estilo por defecto de Swal
        customClass: {
          confirmButton: 'pop-btn-negro',   // Estilo como tu login-pill
          cancelButton: 'pop-btn-blanco',   // Estilo como tu btn-register
          popup: 'pop-redondeado'
        },
        heightAuto: false
      }).then((result) => {
        if (result.isConfirmed) {
          // Si pulsa el botón negro (Registrarse), va a registro
          this.router.navigate(['/registro']);
        }
      });
    }
  }
}