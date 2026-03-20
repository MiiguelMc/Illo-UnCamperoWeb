import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { TiendaService } from '../../services/tienda.service';
import { CuponService } from '../../services/cupon.service';
import { CrearPedidoDTO, ItemPedido, MetodoPago } from '../../../model/pedido.model';
import { ValidacionCupon } from '../../../model/cupon.model';
import { Usuario } from '../../../model/usuario.model';

@Component({
    selector: 'app-confirmar-pedido',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
    templateUrl: './confirmar-pedido.html',
    styleUrls: ['./confirmar-pedido.css']
})
export class ConfirmarPedidoComponent implements OnInit {
    private carritoService = inject(CarritoService);
    private pedidoService = inject(PedidoService);
    private authService = inject(AuthService);
    private tiendaService = inject(TiendaService);
    private cuponService = inject(CuponService);
    private router = inject(Router);

    direccionEntrega = '';
    telefonoContacto = '';
    metodoPago: MetodoPago = 'EFECTIVO';
    notas = '';
    codigoCupon = '';

    usuario = signal<Usuario | null>(null);
    cargando = signal(false);
    error = signal('');
    tiendaAbierta = this.tiendaService.tiendaAbierta;

    cuponAplicado = signal<ValidacionCupon | null>(null);
    validandoCupon = signal(false);
    errorCupon = signal('');

    items = this.carritoService.items;
    totalSinDescuento = this.carritoService.totalPrecio;
    metodosPago: MetodoPago[] = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA'];

    get totalFinal(): number {
        const cupon = this.cuponAplicado();
        if (cupon?.valido && cupon.descuento) {
            return this.totalSinDescuento() * (1 - cupon.descuento / 100);
        }
        return this.totalSinDescuento();
    }

    get descuento(): number {
        return this.totalSinDescuento() - this.totalFinal;
    }

    ngOnInit() {
        if (this.items().length === 0) {
            this.router.navigate(['/carta']);
            return;
        }
        this.authService.user$.subscribe(user => {
            if (user) {
                this.usuario.set(user);
                this.direccionEntrega = user.direccion || '';
                this.telefonoContacto = user.telefono || '';
            } else {
                this.router.navigate(['/login']);
            }
        });
    }

    aplicarCupon() {
        if (!this.codigoCupon.trim()) return;
        this.validandoCupon.set(true);
        this.errorCupon.set('');
        this.cuponAplicado.set(null);

        this.cuponService.validarCupon(this.codigoCupon.trim()).subscribe({
            next: (res) => {
                this.cuponAplicado.set(res);
                this.validandoCupon.set(false);
            },
            error: () => {
                this.errorCupon.set('Cupón no válido o expirado.');
                this.validandoCupon.set(false);
            }
        });
    }

    quitarCupon() {
        this.cuponAplicado.set(null);
        this.codigoCupon = '';
        this.errorCupon.set('');
    }

    async confirmarPedido() {
        if (!this.tiendaAbierta()) {
            this.error.set('El restaurante está cerrado en este momento.');
            return;
        }
        if (!this.direccionEntrega.trim()) {
            this.error.set('Introduce una dirección de entrega.');
            return;
        }
        if (!this.telefonoContacto.trim()) {
            this.error.set('Introduce un teléfono de contacto.');
            return;
        }

        const user = this.usuario();
        if (!user) return;

        this.cargando.set(true);
        this.error.set('');

        const itemsPedido: ItemPedido[] = this.items().map(item => ({
            productoId: item.producto.id?.toString() || '',
            nombre: item.producto.nombre,
            cantidad: item.cantidad,
            precioUnidad: item.producto.precio,
            notas: ''
        }));

        const pedidoDTO: CrearPedidoDTO = {
            idUsuario: user.uid,
            nombreCliente: user.nombre,
            direccion: this.direccionEntrega,
            telefono: this.telefonoContacto,
            productos: itemsPedido,
            notasGenerales: this.notas || undefined,
            metodoPago: this.metodoPago
        };

        this.pedidoService.crearPedido(pedidoDTO).subscribe({
            next: (pedidoId) => {
                this.carritoService.vaciar();
                this.router.navigate(['/pedido-exitoso'], { queryParams: { pedidoId } });
            },
            error: () => {
                this.error.set('Error al procesar el pedido. Inténtalo de nuevo.');
                this.cargando.set(false);
            }
        });
    }

    volver() { this.router.navigate(['/carrito']); }
}
