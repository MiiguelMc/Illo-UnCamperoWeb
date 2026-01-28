import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../model/producto.model';

@Component({
  selector: 'app-producto-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto-item.html',
  styleUrls: ['./producto-item.css']
})
export class ProductoItemComponent {
  // Con esto, el componente padre (restaurante) le pasa el objeto producto
  @Input() producto!: Producto; 
}