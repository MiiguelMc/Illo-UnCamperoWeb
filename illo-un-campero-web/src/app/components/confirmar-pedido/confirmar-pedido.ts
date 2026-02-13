import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { CrearPedidoDTO, ItemPedido, MetodoPago } from '../../../model/pedido.model';
import { Usuario } from '../../../model/usuario.model';

@Component({
  selector: 'app-confirmar-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './confirmar-pedido.html',
  styleUrls: ['./confirmar-pedido.css']
})
export class ConfirmarPedidoComponent implements OnInit {
  private carritoService = inject(CarritoService);
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Datos del formulario
  direccionEntrega = '';
  telefonoContacto = '';
  metodoPago: MetodoPago = 'EFECTIVO';
  notas = '';

  // Estados
  usuario = signal<Usuario | null>(null);
  cargando = signal(false);
  error = signal('');

  // Datos del carrito
  items = this.carritoService.items;
  total = this.carritoService.totalPrecio;

  // Opciones de método de pago
  metodosPago: MetodoPago[] = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA'];

  ngOnInit() {
    // Verificar que hay items en el carrito
    if (this.items().length === 0) {
      this.router.navigate(['/carta']);
      return;
    }

    // Cargar datos del usuario
    this.authService.user$.subscribe(user => {
      if (user) {
        this.usuario.set(user);
        this.direccionEntrega = user.direccion || '';
        this.telefonoContacto = user.telefono || '';
      } else {
        // Si no hay usuario, redirigir al login
        this.router.navigate(['/login']);
      }
    });
  }

async confirmarPedido() {
  // Validaciones
  if (!this.direccionEntrega.trim()) {
    this.error.set('Por favor, introduce una dirección de entrega');
    return;
  }

  if (!this.telefonoContacto.trim()) {
    this.error.set('Por favor, introduce un teléfono de contacto');
    return;
  }

  const user = this.usuario();
  if (!user) {
    this.error.set('Debes iniciar sesión para realizar el pedido');
    return;
  }

  this.cargando.set(true);
  this.error.set('');

  try {
    // Convertir items del carrito al formato del backend
    const itemsPedido: ItemPedido[] = this.items().map(item => ({
      productoId: item.producto.id?.toString() || '', 
      nombre: item.producto.nombre,
      cantidad: item.cantidad,
      precioUnidad: item.producto.precio,
      notas: ''
    }));

    // Crear el DTO del pedido
    const pedidoDTO: CrearPedidoDTO = {
      idUsuario: user.uid,
      nombreCliente: user.nombre,
      direccion: this.direccionEntrega,
      telefono: this.telefonoContacto,
      productos: itemsPedido,
      notasGenerales: this.notas || undefined,
      metodoPago: this.metodoPago
    };

    // Enviar al backend
    this.pedidoService.crearPedido(pedidoDTO).subscribe({
      next: (pedidoId) => {
        console.log('Pedido creado exitosamente con ID:', pedidoId);
        
        // Vaciar el carrito
        this.carritoService.vaciar();
        
        // Redirigir a página de éxito
        this.router.navigate(['/pedido-exitoso'], { 
          queryParams: { pedidoId: pedidoId } 
        });
      },
      error: (err) => {
        console.error('Error al crear pedido:', err);
        this.error.set('Error al procesar el pedido. Por favor, intenta de nuevo.');
        this.cargando.set(false);
      }
    });
  } catch (err) {
    console.error('Error:', err);
    this.error.set('Error inesperado. Por favor, intenta de nuevo.');
    this.cargando.set(false);
  }
}
  volver() {
    this.router.navigate(['/carrito']);
  }
}
