export interface Cupon {
    id?: string;
    codigo: string;
    descuento: number;
    activo: boolean;
}

export interface ValidacionCupon {
    valido: boolean;
    descuento: number;
    mensaje: string;
    codigo?: string; // <--- ESTA ES LA QUE FALTABA, MI LOCO
}