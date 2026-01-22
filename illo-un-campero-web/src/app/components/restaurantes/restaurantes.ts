import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Footer } from "../footer/footer";
import { Header } from "../header-login/header";

@Component({
  selector: 'app-restaurantes',
  standalone: true,
  // QUITA 'Footer' y 'Header' de aquí, deja solo CommonModule y lo que uses de verdad
  imports: [CommonModule], 
  templateUrl: './restaurantes.html',
  styleUrls: ['./restaurantes.css']
})
export class RestaurantesComponent {
  // Datos de ejemplo que luego vendrán de Firebase Firestore
  burgers = [
    {
      name: 'Royal Cheese Burger with extra fries',
      description: '100% beef patty, cheese, onion, pickles, mustard and ketchup.',
      price: '13.10',
      image: 'assets/burger1.jpg'
    },
    {
      name: 'The Classics for 2',
      description: '2 beef patties, 2 cheese slices, special sauce and fries.',
      price: '23.10',
      image: 'assets/burger2.jpg'
    },
    {
      name: 'The Classics for 3',
      description: '3 beef patties, bacon, double cheese and massive fries.',
      price: '33.10',
      image: 'assets/burger3.jpg'
    }
  ];
}