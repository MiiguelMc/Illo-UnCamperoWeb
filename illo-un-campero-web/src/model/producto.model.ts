export interface Producto {
    id?: number;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string;
    subcategoria: string;
    imagen?: string; 
    imagenUrl?: string; 
}