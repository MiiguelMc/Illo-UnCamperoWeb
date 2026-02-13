// MODELOS ADAPTADOS AL BACKEND DE SPRING BOOT - VERSIÓN CORREGIDA

// Representa un item dentro del pedido (LineaPedido en el backend)
export interface ItemPedido {
    productoId: string;           // String (Firebase usa IDs como strings)
    nombre: string;
    cantidad: number;
    precioUnidad: number;         // Campo del backend
    notas?: string;               // Notas específicas del producto
}

// Estados del backend de Spring Boot
export type EstadoPedido = 
    | 'PENDIENTE' 
    | 'COCINANDO' 
    | 'REPARTO' 
    | 'ENTREGADO' 
    | 'CANCELADO';

// Método de pago
export type MetodoPago = 
    | 'EFECTIVO' 
    | 'TARJETA' 
    | 'TRANSFERENCIA';

// Modelo principal del Pedido (como lo devuelve el backend)
export interface Pedido {
    id?: string;                      // ID del pedido
    idUsuario: string;                // UID de Firebase
    nombreCliente?: string;           // Nombre del cliente
    direccion: string;                // Dirección de entrega
    telefono: string;                 // Teléfono de contacto
    productos: ItemPedido[];          // Lista de productos
    total: number;                    // Total del pedido
    estado: EstadoPedido;             // Estado actual
    fecha: number;                    // Timestamp (long en Java)
    notasGenerales?: string;          // Notas del pedido completo
    metodoPago?: MetodoPago;          // Método de pago (opcional)
}

// DTO para crear un nuevo pedido (lo que enviamos al backend)
export interface CrearPedidoDTO {
    idUsuario: string;                // UID del usuario
    nombreCliente: string;            // Nombre del cliente
    direccion: string;                // Dirección de entrega
    telefono: string;                 // Teléfono de contacto
    productos: ItemPedido[];          // Lista de productos
    notasGenerales?: string;          // Notas opcionales
    metodoPago?: MetodoPago;          // Método de pago
}