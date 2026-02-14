import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { Pedido, EstadoPedido } from '../../../model/pedido.model';
import { interval, Subscription } from 'rxjs';
import { PedidoCardCocinaComponent } from '../pedido-card-cocina/pedido-card-cocina';

@Component({
  selector: 'app-cocina-dashboard',
  standalone: true,
  imports: [CommonModule, PedidoCardCocinaComponent],
  templateUrl: './cocina-dashboard.html',
  styleUrls: ['./cocina-dashboard.css']
})
export class CocinaDashboardComponent implements OnInit, OnDestroy {
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  // Estados
  pedidosPendientes = signal<Pedido[]>([]);
  pedidosCocinando = signal<Pedido[]>([]);
  pedidosReparto = signal<Pedido[]>([]);
  
  cargando = signal(true);
  error = signal('');
  usuarioAutenticado = signal(false);
  
  // Audio para notificaciones
  private audioNotificacion: HTMLAudioElement | null = null;
  
  // Subscripción para auto-refresh
  private refreshSubscription?: Subscription;
  
  // Contador de pedidos anterior (para detectar nuevos)
  private pedidosAnteriores = 0;

  ngOnInit() {
    // Verificar autenticación primero
    this.authService.user$.subscribe({
      next: (user) => {
        if (user) {
          this.usuarioAutenticado.set(true);
          this.error.set('');
          
          // Inicializar audio de notificación
          this.inicializarAudio();
          
          // Cargar pedidos inicialmente
          this.cargarPedidos();
          
          // Auto-refresh cada 30 segundos
          this.refreshSubscription = interval(30000).subscribe(() => {
            this.cargarPedidos(true);
          });
        } else {
          this.usuarioAutenticado.set(false);
          this.error.set('Debes iniciar sesión para acceder al panel de cocina');
          this.cargando.set(false);
          
          // Redirigir al login después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/login'], { 
              queryParams: { returnUrl: '/cocina' } 
            });
          }, 2000);
        }
      },
      error: (err) => {
        console.error('Error de autenticación:', err);
        this.error.set('Error al verificar autenticación');
        this.cargando.set(false);
      }
    });
  }

  ngOnDestroy() {
    // Limpiar subscripción al destruir componente
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  inicializarAudio() {
    // Audio ya inicializado
  }

  cargarPedidos(esAutoRefresh: boolean = false) {
    // Solo cargar si está autenticado
    if (!this.usuarioAutenticado()) {
      return;
    }

    this.pedidoService.obtenerTodosPedidos().subscribe({
      next: (pedidos) => {
        // Filtrar y organizar por estado
        const pendientes = pedidos.filter(p => p.estado === 'PENDIENTE');
        const cocinando = pedidos.filter(p => p.estado === 'COCINANDO');
        const reparto = pedidos.filter(p => p.estado === 'REPARTO');
        
        // Si es auto-refresh y hay más pedidos que antes, reproducir sonido
        if (esAutoRefresh) {
          const totalActual = pendientes.length + cocinando.length + reparto.length;
          if (totalActual > this.pedidosAnteriores) {
            this.reproducirNotificacion();
          }
          this.pedidosAnteriores = totalActual;
        } else {
          // Primera carga, solo guardar el contador
          this.pedidosAnteriores = pendientes.length + cocinando.length + reparto.length;
        }
        
        // Actualizar signals
        this.pedidosPendientes.set(pendientes);
        this.pedidosCocinando.set(cocinando);
        this.pedidosReparto.set(reparto);
        
        this.cargando.set(false);
        this.error.set('');
      },
      error: (err) => {
        console.error('Error al cargar pedidos:', err);
        
        // Mensajes de error más específicos
        if (err.status === 401) {
          this.error.set('Sesión expirada. Redirigiendo al login...');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else if (err.status === 0) {
          this.error.set('No se puede conectar con el servidor. Verifica tu conexión.');
        } else {
          this.error.set('Error al cargar pedidos. Intentando de nuevo...');
        }
        
        this.cargando.set(false);
      }
    });
  }

  reproducirNotificacion() {
    // Crear un contexto de audio simple
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('No se pudo reproducir el sonido:', error);
    }
  }

  // Método para cambiar estado de un pedido
  cambiarEstado(pedidoId: string, nuevoEstado: EstadoPedido) {
    if (!this.usuarioAutenticado()) {
      alert('Debes iniciar sesión para cambiar estados');
      return;
    }

    this.pedidoService.actualizarEstadoPedido(pedidoId, nuevoEstado).subscribe({
      next: (respuesta) => {
        console.log('Estado actualizado:', respuesta);
        // Recargar pedidos después de cambiar estado
        this.cargarPedidos();
      },
      error: (err) => {
        console.error('Error al cambiar estado:', err);
        
        if (err.status === 401) {
          alert('Sesión expirada. Por favor, inicia sesión de nuevo.');
          this.router.navigate(['/login']);
        } else if (err.status === 0) {
          alert('No se puede conectar con el servidor. Verifica tu conexión.');
        } else {
          alert('Error al cambiar el estado del pedido. Intenta de nuevo.');
        }
      }
    });
  }

  // Método para refrescar manualmente
  refrescarManual() {
    if (!this.usuarioAutenticado()) {
      alert('Debes iniciar sesión primero');
      return;
    }
    
    this.cargando.set(true);
    this.cargarPedidos();
  }
}