export interface Usuario {
    uid: string;
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    rol: string;
}


export interface Producto {
    id?: number; // El ? es por si el id lo genera el backend
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
}