export interface ItemPedido {
    productoId: string;
    nombre: string;
    cantidad: number;
    precioUnidad: number;
    notas?: string;
}

export type EstadoPedido =
    | 'PENDIENTE'
    | 'COCINANDO'
    | 'REPARTO'
    | 'ENTREGADO'
    | 'CANCELADO';

export type MetodoPago =
    | 'EFECTIVO'
    | 'TARJETA';

export interface Pedido {
    id?: string;
    idUsuario: string;
    nombreCliente?: string;
    direccion: string;
    telefono: string;
    productos: ItemPedido[];
    total: number;
    estado: EstadoPedido;
    fecha: number;
    notasGenerales?: string;
    metodoPago?: MetodoPago;
    cupon?: string;
    descuento?: number;
    valorado?: boolean;
}

export interface CrearPedidoDTO {
    idUsuario: string;
    nombreCliente: string;
    direccion: string;
    telefono: string;
    productos: ItemPedido[];
    notasGenerales?: string;
    metodoPago?: MetodoPago;
    descuento?: number; // euros quitados si hay cupon
    cupon?: string;
}
