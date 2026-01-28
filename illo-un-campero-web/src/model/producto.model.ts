export interface Producto {
    id?: string;
    nombre: string;
    descripcion: string;
    precio: number;
    imagenUrl: string;
    categoria: string; // "burgers", "patatas", "ensaladas", etc.
  }