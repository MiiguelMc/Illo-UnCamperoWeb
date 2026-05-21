import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, firstValueFrom } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { CarritoService } from '../../services/carrito.service';
import { PedidoService } from '../../services/pedido.service';
import { PagoService } from '../../services/pago.service';
import { AuthService } from '../../services/auth.service';
import { TiendaService } from '../../services/tienda.service';
import { CuponService } from '../../services/cupon.service';
import { CrearPedidoDTO, ItemPedido, MetodoPago } from '../../../model/pedido.model';
import { ValidacionCupon } from '../../../model/cupon.model';
import { Usuario } from '../../../model/usuario.model';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-confirmar-pedido',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
    templateUrl: './confirmar-pedido.html',
    styleUrls: ['./confirmar-pedido.css']
})
export class ConfirmarPedidoComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private carritoService = inject(CarritoService);
    private pedidoService = inject(PedidoService);
    private pagoService = inject(PagoService);
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

    // Stripe
    private stripe: Stripe | null = null;
    private cardElement: StripeCardElement | null = null;
    stripeListoParaPagar = signal(false);
    errorStripe = signal('');

    items = this.carritoService.items;
    totalSinDescuento = this.carritoService.totalPrecio;
    metodosPago: MetodoPago[] = ['EFECTIVO', 'TARJETA'];

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
        this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
            if (user) {
                this.usuario.set(user);
                this.direccionEntrega = user.direccion || '';
                this.telefonoContacto = user.telefono || '';
            } else if (user === null) {
                this.router.navigate(['/login']);
            }
        });
    }

    seleccionarMetodo(metodo: MetodoPago) {
        if (this.cargando()) return;
        this.metodoPago = metodo;
        this.onMetodoPagoChange();
    }

    // Se llama cuando el usuario cambia el método de pago
    onMetodoPagoChange() {
        if (this.metodoPago === 'TARJETA') {
            // Pequeño delay para que Angular renderice el div antes de montar Stripe
            setTimeout(() => this.montarStripe(), 50);
        } else {
            this.desmontarStripe();
        }
    }

    private async montarStripe() {
        this.errorStripe.set('');

        // Carga Stripe solo la primera vez
        if (!this.stripe) {
            this.stripe = await loadStripe(environment.stripePublishableKey);
        }
        if (!this.stripe) {
            this.errorStripe.set('No se pudo cargar el sistema de pago.');
            return;
        }

        // Si ya hay un card element montado, lo destruimos y creamos uno nuevo
        if (this.cardElement) {
            this.cardElement.destroy();
            this.cardElement = null;
        }

        const elements = this.stripe.elements();
        this.cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '15px',
                    color: '#333333',
                    fontFamily: 'Poppins, sans-serif',
                    '::placeholder': { color: '#999999' }
                },
                invalid: { color: '#e74c3c' }
            }
        });

        const container = document.getElementById('stripe-card-element');
        if (container) {
            this.cardElement.mount(container);
            this.cardElement.on('change', (event) => {
                this.stripeListoParaPagar.set(event.complete);
                this.errorStripe.set(event.error?.message || '');
            });
        }
    }

    private desmontarStripe() {
        if (this.cardElement) {
            this.cardElement.destroy();
            this.cardElement = null;
        }
        this.stripeListoParaPagar.set(false);
        this.errorStripe.set('');
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

        const cup = this.cuponAplicado();
        const subtotal = this.totalSinDescuento();
        if (cup?.valido && cup.descuento && subtotal > 0) {
            const ahorro = subtotal - this.totalFinal;
            if (ahorro > 0) {
                pedidoDTO.descuento = Math.round(ahorro * 100) / 100;
                pedidoDTO.cupon = (cup.codigo || this.codigoCupon).trim().toUpperCase();
            }
        }

        // 1. Crear el pedido primero para obtener el ID
        let pedidoId: string;
        try {
            pedidoId = await firstValueFrom(this.pedidoService.crearPedido(pedidoDTO));
        } catch {
            this.error.set('Error al procesar el pedido. Inténtalo de nuevo.');
            this.cargando.set(false);
            return;
        }

        // 2. Si es TARJETA, Stripe usa el ID del pedido para obtener el total desde el servidor
        if (this.metodoPago === 'TARJETA') {
            const pagoOk = await this.procesarPagoStripe(pedidoId);
            if (!pagoOk) {
                // Cancelar el pedido si el pago falla
                this.pedidoService.cancelarPedido(pedidoId).subscribe();
                this.cargando.set(false);
                return;
            }
            // 3. Confirmar el pago en el backend (cambia PENDIENTE_PAGO → PENDIENTE)
            try {
                await firstValueFrom(this.pedidoService.confirmarPago(pedidoId));
            } catch {
                // El webhook de Stripe también lo hará, no bloqueamos al usuario
            }
        }

        this.carritoService.vaciar();
        this.router.navigate(['/pedido-exitoso'], { queryParams: { pedidoId } });
    }

    private async procesarPagoStripe(pedidoId: string): Promise<boolean> {
        if (!this.stripe || !this.cardElement) {
            this.error.set('El sistema de pago no está listo. Espera un momento.');
            return false;
        }

        try {
            // El backend calcula el total desde la BD usando el pedidoId
            const { clientSecret } = await firstValueFrom(
                this.pagoService.crearIntent(pedidoId)
            );

            // 2. Confirmamos el pago con Stripe directamente desde el navegador
            const resultado = await this.stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: this.cardElement }
            });

            if (resultado.error) {
                this.error.set(resultado.error.message || 'Error al procesar la tarjeta.');
                return false;
            }

            if (resultado.paymentIntent?.status !== 'succeeded') {
                this.error.set('El pago no se ha completado. Inténtalo de nuevo.');
                return false;
            }

            return true;
        } catch (err: any) {
            console.error('Error Stripe/crear-intent:', err?.status, err?.error || err);
            this.error.set('Error al conectar con el sistema de pago. Inténtalo de nuevo.');
            return false;
        }
    }

    ngOnDestroy() {
        this.desmontarStripe();
        this.destroy$.next();
        this.destroy$.complete();
    }

    volver() { this.router.navigate(['/carrito']); }
}
