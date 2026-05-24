import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-privacidad',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './privacidad.html',
    styleUrls: ['./privacidad.css']
})
export class PrivacidadComponent {}
