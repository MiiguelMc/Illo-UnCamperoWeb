export interface Cupon {
    id?: string;
    codigo: string;
    descuento: number;
    activo: boolean;
}

export interface ValidacionCupon {
    valido: boolean;
    descuento: number;
    mensaje?: string; // a veces no viene
    descripcion?: string;
    codigo?: string;
}