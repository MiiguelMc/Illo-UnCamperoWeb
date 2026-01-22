<<<<<<< HEAD
// import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

=======
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // IMPORTANTE: Hay que importar esto
import { AuthService } from './services/auth.service';
>>>>>>> main

//@Component({
  //selector: 'app-root',
  //imports: [RouterOutlet],
  //templateUrl: './app.html',
  //styleUrl: './app.css'
//})
//export class App {
  //protected readonly title = signal('illo-un-campero-web');
//}
import { Component, inject } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [AsyncPipe, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
// CAMBIA ESTO: De AppComponent a App
export class App { 
  private firestore = inject(Firestore);
  campero$: Observable<any>;

  constructor() {
    const ref = doc(this.firestore, 'carta/campero_pollo');
    this.campero$ = docData(ref);
  }
}
=======
  imports: [CommonModule, RouterOutlet], // AÑADE RouterOutlet AQUÍ
  template: `
    <!-- Aquí puedes poner tu Navbar más adelante -->
    <router-outlet></router-outlet>
  `
})
export class AppComponent { // La llamamos AppComponent (con "Component" al final)
  public auth = inject(AuthService);
}
>>>>>>> main
