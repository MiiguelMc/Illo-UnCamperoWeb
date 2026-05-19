import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-aviso-legal',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './aviso-legal.html',
  styleUrls: ['./aviso-legal.css'],
})
export class AvisoLegalComponent {}
