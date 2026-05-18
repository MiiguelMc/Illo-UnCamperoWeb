import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-aviso-legal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './aviso-legal.html',
  styleUrls: ['./aviso-legal.css'],
})
export class AvisoLegalComponent {}
