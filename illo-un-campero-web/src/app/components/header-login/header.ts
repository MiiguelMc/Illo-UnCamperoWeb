import { Component, inject } from '@angular/core';
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
  public router = inject(Router); // Para las clases activas

  comprobarPedido() {
    // Al no estar logueado, soltamos el pop-up "Real hasta la muerte"
    Swal.fire({
      title: '<strong>¿Aún no te has registrado?</strong>',
      text: 'Para gestionar tus pedidos echa un vistazo a nuestra zona de registro.',
      icon: 'info',
      iconColor: '#f39200',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'Registrarse',
      cancelButtonText: 'Ahora no',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'pop-btn-negro',   // Estas clases deben seguir en styles.css global
        cancelButton: 'pop-btn-blanco',
        popup: 'pop-redondeado'
      },
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/registro']);
      }
    });
  }
}