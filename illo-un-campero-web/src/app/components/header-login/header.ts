import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <--- IMPORTANTE

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule], // <--- AÑÁDELO AQUÍ
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  // ... tu lógica
}