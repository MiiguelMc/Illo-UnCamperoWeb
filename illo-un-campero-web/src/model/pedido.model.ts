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
    | 'TARJETA'
    | 'TRANSFERENCIA';

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
}

export interface CrearPedidoDTO {
    idUsuario: string;
    nombreCliente: string;
    direccion: string;
    telefono: string;
    productos: ItemPedido[];
    notasGenerales?: string;
    metodoPago?: MetodoPago;
}
