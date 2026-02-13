import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pedido-exitoso',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pedido-exitoso.html',
  styleUrls: ['./pedido-exitoso.css']
})
export class PedidoExitosoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  pedidoId = signal<string | null>(null);

  ngOnInit() {
    // Obtener el ID del pedido de los query params
    this.route.queryParams.subscribe(params => {
      this.pedidoId.set(params['pedidoId'] || null);
    });
  }

  irARestaurantes() {
    this.router.navigate(['/restaurantes']);
  }

  verMisPedidos() {
    this.router.navigate(['/mis-pedidos']);
  }
}
