export interface Producto {
    id?: string;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string;
    subcategoria: string;
    imagenUrl?: string; 
    disponible?: boolean;
    esOferta?: boolean;
}