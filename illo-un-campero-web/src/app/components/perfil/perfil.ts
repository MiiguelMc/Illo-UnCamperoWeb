import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service';
import { TiendaService } from '../../services/tienda.service';
import { CuponService } from '../../services/cupon.service';
import { Usuario } from '../../../model/usuario.model';
import { Pedido, EstadoPedido } from '../../../model/pedido.model';
import { Cupon } from '../../../model/cupon.model';
import { GestionProductosComponent } from '../gestion-productos/gestion-productos';
import { interval, Subscription } from 'rxjs';

type TabActiva = 'perfil' | 'admin';
type SubTabAdmin = 'pedidos' | 'productos' | 'cupones' | 'estadisticas' | 'tienda';

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, GestionProductosComponent, TranslateModule, RouterModule],
    templateUrl: './perfil.html',
    styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit, OnDestroy {
    private authService = inject(AuthService);
    private pedidoService = inject(PedidoService);
    private tiendaService = inject(TiendaService);
    private cuponService = inject(CuponService);
    private fb = inject(FormBuilder);
    private router = inject(Router);

    profileForm: FormGroup;
    usuario: Usuario | null = null;
    mensaje = '';
    mensajeError = '';

    tabActiva = signal<TabActiva>('perfil');
    subTabAdmin = signal<SubTabAdmin>('pedidos');
    esAdmin = signal(false);

    // Pedidos admin
    pedidosActivos = signal<Pedido[]>([]);
    cargandoPedidos = signal(false);
    errorPedidos = signal('');

    // Estadísticas
    estadisticas = signal<{ totalDinero: number; totalPedidos: number } | null>(null);
    topProductos = signal<{ nombre: string; unidades: number }[]>([]);
    filtroDesde = '';
    filtroHasta = '';

    // Tienda
    tiendaAbierta = this.tiendaService.tiendaAbierta;
    guardandoEstado = signal(false);

    // Cupones
    cupones = signal<Cupon[]>([]);
    nuevoCuponCodigo = '';
    nuevoCuponDescuento: number | null = null;
    guardandoCupon = signal(false);
    mensajeCupon = signal('');

    // Eliminar cuenta
    confirmandoEliminar = signal(false);
    eliminandoCuenta = signal(false);

    private refreshSub?: Subscription;

    readonly estadosDisponibles: EstadoPedido[] = ['PENDIENTE', 'COCINANDO', 'REPARTO', 'ENTREGADO', 'CANCELADO'];

    constructor() {
        this.profileForm = this.fb.group({
            nombre: ['', [Validators.required, Validators.minLength(3)]],
            email: [{ value: '', disabled: true }],
            telefono: ['', [Validators.required, Validators.pattern(/^[6-9]\d{8}$/)]],
            direccion: ['', [Validators.required]]
        });
    }

    ngOnInit() {
        this.authService.user$.subscribe((user: Usuario | null) => {
            if (user) {
                this.usuario = user;
                this.profileForm.patchValue({
                    nombre: user.nombre,
                    email: user.email,
                    telefono: user.telefono || '',
                    direccion: user.direccion || ''
                });
                const rol = user.rol?.toUpperCase();
                this.esAdmin.set(rol === 'ADMIN' || rol === 'COCINA');
            }
        });
    }

    ngOnDestroy() {
        this.refreshSub?.unsubscribe();
    }

    setTab(tab: TabActiva) {
        this.tabActiva.set(tab);
        if (tab === 'admin') this.cargarDatosAdmin();
    }

    setSubTab(sub: SubTabAdmin) {
        this.subTabAdmin.set(sub);
        if (sub === 'pedidos') this.cargarPedidos();
        if (sub === 'estadisticas') this.cargarEstadisticas();
        if (sub === 'cupones') this.cargarCupones();
    }

    cargarDatosAdmin() {
        this.cargarPedidos();
        this.cargarEstadisticas();
        this.refreshSub?.unsubscribe();
        this.refreshSub = interval(30000).subscribe(() => {
            if (this.subTabAdmin() === 'pedidos') this.cargarPedidos(true);
            if (this.subTabAdmin() === 'estadisticas') this.cargarEstadisticas();
        });
    }

    cargarPedidos(silencioso = false) {
        if (!silencioso) this.cargandoPedidos.set(true);
        this.errorPedidos.set('');
        this.pedidoService.obtenerTodosPedidosAdmin().subscribe({
            next: (pedidos) => {
                this.pedidosActivos.set(pedidos.sort((a, b) => b.fecha - a.fecha));
                this.cargandoPedidos.set(false);
            },
            error: () => {
                this.errorPedidos.set('No se pudieron cargar los pedidos.');
                this.cargandoPedidos.set(false);
            }
        });
    }

    cargarEstadisticas() {
        const desde = this.filtroDesde ? new Date(this.filtroDesde).setHours(0, 0, 0, 0) : undefined;
        const hasta = this.filtroHasta ? new Date(this.filtroHasta).setHours(23, 59, 59, 999) : undefined;

        if (desde || hasta) {
            this.pedidoService.obtenerTodosPedidosAdmin(desde, hasta).subscribe({
                next: (pedidos) => {
                    let totalDinero = 0;
                    let totalPedidos = 0;
                    for (const p of pedidos) {
                        if (p.estado !== 'CANCELADO') {
                            totalDinero += p.total;
                            totalPedidos++;
                        }
                    }
                    this.estadisticas.set({ totalDinero, totalPedidos });
                },
                error: () => this.estadisticas.set(null)
            });
        } else {
            this.pedidoService.obtenerEstadisticasHoy().subscribe({
                next: (datos) => this.estadisticas.set(datos),
                error: () => this.estadisticas.set(null)
            });
        }

        this.pedidoService.obtenerTopProductos(desde, hasta).subscribe({
            next: (lista) => this.topProductos.set(lista),
            error: () => this.topProductos.set([])
        });
    }

    aplicarFiltroEstadisticas() {
        this.cargarEstadisticas();
    }

    cargarCupones() {
        this.cuponService.listarCupones().subscribe({
            next: (lista) => this.cupones.set(lista),
            error: () => {}
        });
    }

    cambiarEstadoPedido(pedidoId: string, nuevoEstado: EstadoPedido) {
        this.pedidoService.actualizarEstadoPedido(pedidoId, nuevoEstado).subscribe({
            next: () => this.cargarPedidos(true),
            error: () => alert('No se pudo cambiar el estado.')
        });
    }

    toggleTienda() {
        this.guardandoEstado.set(true);
        const nuevo = !this.tiendaAbierta();
        this.tiendaService.cambiarEstado(nuevo).subscribe({
            next: () => {
                this.tiendaService.tiendaAbierta.set(nuevo);
                this.guardandoEstado.set(false);
            },
            error: () => {
                alert('No se pudo cambiar el estado de la tienda.');
                this.guardandoEstado.set(false);
            }
        });
    }

    crearCupon() {
        if (!this.nuevoCuponCodigo || !this.nuevoCuponDescuento) return;
        this.guardandoCupon.set(true);
        this.cuponService.crearCupon({
            codigo: this.nuevoCuponCodigo,
            descuento: this.nuevoCuponDescuento
        }).subscribe({
            next: () => {
                this.mensajeCupon.set('Cupón creado correctamente.');
                this.nuevoCuponCodigo = '';
                this.nuevoCuponDescuento = null;
                this.guardandoCupon.set(false);
                this.cargarCupones();
                setTimeout(() => this.mensajeCupon.set(''), 3000);
            },
            error: () => {
                this.mensajeCupon.set('Error al crear el cupón.');
                this.guardandoCupon.set(false);
            }
        });
    }

    desactivarCupon(id: string) {
        this.cuponService.desactivarCupon(id).subscribe({
            next: () => this.cargarCupones()
        });
    }

    guardarCambios() {
        this.mensaje = '';
        this.mensajeError = '';
        if (this.profileForm.valid && this.usuario) {
            const datosActualizados: Usuario = { ...this.usuario, ...this.profileForm.getRawValue() };
            this.authService.updateUserData(this.usuario.uid, datosActualizados).subscribe({
                next: () => {
                    this.usuario = datosActualizados;
                    this.mensaje = 'Perfil actualizado correctamente.';
                    setTimeout(() => this.mensaje = '', 3000);
                },
                error: (err) => {
                    const msg = typeof err?.error === 'string' ? err.error : err?.error?.message;
                    this.mensajeError = msg || 'Error al guardar los cambios.';
                }
            });
        } else {
            this.mensajeError = 'Revisa los campos del formulario.';
        }
    }

    cambiarPass() {
        if (this.usuario?.email) {
            this.authService.sendPasswordReset(this.usuario.email).then(() => {
                this.mensaje = 'Correo enviado para cambiar la contraseña.';
                setTimeout(() => this.mensaje = '', 5000);
            }).catch(() => {
                this.mensajeError = 'Error al enviar el correo.';
            });
        }
    }

    async eliminarCuenta() {
        this.eliminandoCuenta.set(true);
        try {
            await this.authService.eliminarCuenta();
            this.router.navigate(['/login']);
        } catch {
            this.mensajeError = 'No se pudo eliminar la cuenta. Inténtalo de nuevo.';
            this.eliminandoCuenta.set(false);
            this.confirmandoEliminar.set(false);
        }
    }

    getEstadoColor(estado: string): string {
        const colores: Record<string, string> = {
            PENDIENTE: '#f39c12', COCINANDO: '#3498db',
            REPARTO: '#1abc9c', ENTREGADO: '#27ae60', CANCELADO: '#e74c3c'
        };
        return colores[estado] || '#95a5a6';
    }

    formatearFecha(fecha: number): string {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }

    tiempoDesde(fecha: number): string {
        const min = Math.floor((Date.now() - fecha) / 60000);
        return min < 60 ? `Hace ${min} min` : `Hace ${Math.floor(min / 60)}h ${min % 60}m`;
    }

    idCorto(id: string): string {
        return id.substring(0, 8).toUpperCase();
    }
}
