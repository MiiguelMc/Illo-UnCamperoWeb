export interface Producto {
    id?: number;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string;
    subcategoria: string;
    // Permitimos ambos nombres para que no falle la imagen
    imagen?: string; 
    imagenUrl?: string; 
}