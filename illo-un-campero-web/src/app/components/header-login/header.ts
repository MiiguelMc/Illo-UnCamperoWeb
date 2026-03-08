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
  public router = inject(Router);
  menuMovilAbierto = false;

  // ESTA FUNCIÓN ABRE Y CIERRA EL CHIRINGUITO EN EL MÓVIL
  toggleMenu() {
    this.menuMovilAbierto = !this.menuMovilAbierto;
  }

  comprobarPedido() {
    // Cerramos el menú del móvil antes de soltar el bombazo del pop-up
    this.menuMovilAbierto = false;

    Swal.fire({
      title: '¡Epa, primo!',
      text: 'Para poder ver tu pedido y que te llegue el campero a casa, primero tienes que registrarte en la familia.',
      icon: 'info',
      iconColor: '#f39200',
      showCancelButton: true,
      confirmButtonText: '¡Me registro!',
      cancelButtonText: 'Luego lo hago',
      confirmButtonColor: '#f39200',
      cancelButtonColor: '#0d1117',
      heightAuto: false,
      backdrop: `rgba(0,0,123,0.1)`, // Un toquecito de color al fondo para que resalte
      customClass: {
        popup: 'pop-redondeado' // Clase por si quieres redondearlo más en CSS
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Directo al bloque de registro, berraco
        this.router.navigate(['/registro']);
      }
    });
  }
}