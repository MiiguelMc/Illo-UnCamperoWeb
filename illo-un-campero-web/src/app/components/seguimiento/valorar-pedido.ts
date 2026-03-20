import { Component, OnInit, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResenaService } from '../../services/resena.service';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../../model/pedido.model';

@Component({
    selector: 'app-valorar-pedido',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
    templateUrl: './valorar-pedido.html',
    styleUrls: ['./valorar-pedido.css']
})
export class ValorarPedidoComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private resenaService = inject(ResenaService);
    private pedidoService = inject(PedidoService);

    pedido = signal<Pedido | null>(null);
    puntuacion = signal(0);
    comentario = '';
    enviando = signal(false);
    exito = signal(false);
    error = signal('');

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id') || '';
        if (!id) { this.router.navigate(['/mis-pedidos']); return; }

        this.pedidoService.obtenerPedidoPorId(id).subscribe({
            next: (p) => {
                if (p.estado !== 'ENTREGADO') {
                    this.router.navigate(['/mis-pedidos']);
                    return;
                }
                this.pedido.set(p);
            },
            error: () => this.router.navigate(['/mis-pedidos'])
        });
    }

    setPuntuacion(n: number) {
        this.puntuacion.set(n);
    }

    enviarResena() {
        if (this.puntuacion() === 0) {
            this.error.set('Selecciona una puntuación.');
            return;
        }
        this.enviando.set(true);
        this.error.set('');
        this.resenaService.crearResena({
            idPedido: this.pedido()!.id!,
            puntuacion: this.puntuacion(),
            comentario: this.comentario
        }).subscribe({
            next: () => {
                this.exito.set(true);
                this.enviando.set(false);
                setTimeout(() => this.router.navigate(['/mis-pedidos']), 2500);
            },
            error: (err) => {
                this.error.set(err?.error || 'Error al enviar la valoración.');
                this.enviando.set(false);
            }
        });
    }

    getEstrellas(n: number): boolean[] {
        return Array(5).fill(false).map((_, i) => i < n);
    }
}
