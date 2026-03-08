import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class Footer { // <--- AQUÍ ESTÁ EL TRUCO: Lo dejamos como Footer a secas
  // Si necesitas lógica pal' footer, métela aquí, berraco.
}