// lo que devuelve /api/resenas (nombreUsuario lo añade el back)
export interface Resena {
    id?: string;
    idPedido?: string;
    idUsuario?: string;
    nombreUsuario?: string;
    comentario?: string;
    puntuacion: number;
    fecha: number;
}