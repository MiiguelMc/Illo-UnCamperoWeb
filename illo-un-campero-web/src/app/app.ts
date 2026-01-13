// import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';


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
