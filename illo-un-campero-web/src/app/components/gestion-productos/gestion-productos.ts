import { Component, OnInit, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../../model/producto.model';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-gestion-productos',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule],
    templateUrl: './gestion-productos.html',
    styleUrls: ['./gestion-productos.css']
})
export class GestionProductosComponent implements OnInit {
    private productoService = inject(ProductoService);
    private http = inject(HttpClient);
    private translate = inject(TranslateService);
    private fb = inject(FormBuilder);

    productos = signal<Producto[]>([]);
    cargando = signal(true);
    error = signal('');
    modoFormulario = signal<'cerrado' | 'nuevo' | 'editar'>('cerrado');
    productActual = signal<Producto | null>(null);
    guardando = signal(false);
    mensajeExito = signal('');

    // Subida de imagen — pendiente de conectar con el servicio de almacenamiento
    subiendoImagen = signal(false);
    progresoImagen = signal(0);
    errorImagen = signal('');

    form: FormGroup;

    readonly categorias = ['camperos', 'bebidas', 'entrantes', 'postres'];
    readonly subcategorias: Record<string, string[]> = {
        camperos: ['clasicos', 'especiales', 'veganos'],
        bebidas: ['frias', 'calientes', 'zumos'],
        entrantes: ['fritos', 'ensaladas'],
        postres: ['dulces']
    };

    subcategoriasDisponibles = signal<string[]>([]);

    constructor() {
        this.form = this.fb.group({
            nombre: ['', [Validators.required, Validators.minLength(2)]],
            descripcion: [''],
            precio: [null, [Validators.required, Validators.min(0.01)]],
            categoria: ['', Validators.required],
            subcategoria: ['', Validators.required],
            imagenUrl: [''],
            disponible: [true],
            esOferta: [false]
        });

        this.form.get('categoria')?.valueChanges.subscribe(cat => {
            this.subcategoriasDisponibles.set(this.subcategorias[cat] || []);
            this.form.get('subcategoria')?.setValue('');
        });
    }

    ngOnInit() {
        this.cargarProductos();
    }

    cargarProductos() {
        this.cargando.set(true);
        this.productoService.obtenerProductos().subscribe({
            next: (lista) => {
                this.productos.set(lista.sort((a, b) => a.nombre.localeCompare(b.nombre)));
                this.cargando.set(false);
            },
            error: () => {
                this.error.set('Error al cargar productos.');
                this.cargando.set(false);
            }
        });
    }

    abrirNuevo() {
        this.form.reset({ disponible: true, esOferta: false });
        this.productActual.set(null);
        this.modoFormulario.set('nuevo');
        this.mensajeExito.set('');
        this.errorImagen.set('');
    }

    abrirEditar(p: Producto) {
        this.productActual.set(p);
        this.subcategoriasDisponibles.set(this.subcategorias[p.categoria] || []);
        this.form.patchValue({
            nombre: p.nombre,
            descripcion: p.descripcion || '',
            precio: p.precio,
            categoria: p.categoria,
            subcategoria: p.subcategoria,
            imagenUrl: p.imagenUrl || '',
            disponible: p.disponible !== false,
            esOferta: p.esOferta === true
        });
        this.modoFormulario.set('editar');
        this.mensajeExito.set('');
        this.errorImagen.set('');
    }

    cerrarFormulario() {
        this.modoFormulario.set('cerrado');
        this.form.reset();
        this.errorImagen.set('');
        this.progresoImagen.set(0);
    }

    onArchivoSeleccionado(event: Event) {
        const input = event.target as HTMLInputElement;
        const archivo = input.files?.[0];
        if (!archivo) return;

        const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
        if (!tiposPermitidos.includes(archivo.type)) {
            this.errorImagen.set(this.translate.instant('GESTION.UPLOAD_ERR_TIPO'));
            return;
        }
        if (archivo.size > 2 * 1024 * 1024) {
            this.errorImagen.set(this.translate.instant('GESTION.UPLOAD_ERR_TAMANO'));
            return;
        }

        this.errorImagen.set('');
        this.subiendoImagen.set(true);
        this.progresoImagen.set(0);

        // 1. Pedir la firma al backend (el api_secret nunca sale del servidor)
        this.http.get<{ timestamp: string; signature: string; apiKey: string; cloudName: string }>(
            `${environment.apiUrl}/cloudinary/firma`
        ).subscribe({
            next: (firma) => {
                // 2. Subir directamente a Cloudinary con la firma
                const formData = new FormData();
                formData.append('file', archivo);
                formData.append('api_key', firma.apiKey);
                formData.append('timestamp', firma.timestamp);
                formData.append('signature', firma.signature);
                formData.append('folder', 'productos');

                const uploadUrl = `https://api.cloudinary.com/v1_1/${firma.cloudName}/image/upload`;

                this.http.post<{ secure_url: string }>(uploadUrl, formData).subscribe({
                    next: (res) => {
                        this.form.patchValue({ imagenUrl: res.secure_url });
                        this.subiendoImagen.set(false);
                        this.progresoImagen.set(100);
                        setTimeout(() => this.progresoImagen.set(0), 800);
                    },
                    error: () => {
                        this.errorImagen.set('Error al subir la imagen a Cloudinary.');
                        this.subiendoImagen.set(false);
                    }
                });
            },
            error: () => {
                this.errorImagen.set('No se pudo obtener la firma del servidor.');
                this.subiendoImagen.set(false);
            }
        });
    }

    guardar() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        if (this.subiendoImagen()) return;

        this.guardando.set(true);
        const datos: Producto = this.form.getRawValue();
        const modo = this.modoFormulario();
        const id = this.productActual()?.id;

        const op = modo === 'editar' && id
            ? this.productoService.editarProducto(id, datos)
            : this.productoService.crearProducto(datos);

        op.subscribe({
            next: () => {
                this.mensajeExito.set(modo === 'nuevo' ? 'Producto creado.' : 'Producto actualizado.');
                this.guardando.set(false);
                this.cerrarFormulario();
                this.cargarProductos();
            },
            error: () => {
                this.error.set('Error al guardar el producto.');
                this.guardando.set(false);
            }
        });
    }

    eliminar(p: Producto) {
        if (!confirm(`¿Borrar "${p.nombre}"? Esta acción no se puede deshacer.`)) return;
        this.productoService.eliminarProducto(p.id!).subscribe({
            next: () => this.cargarProductos(),
            error: () => alert('No se pudo eliminar el producto.')
        });
    }

    toggleDisponible(p: Producto) {
        const actualizado: Producto = { ...p, disponible: !p.disponible };
        this.productoService.editarProducto(p.id!, actualizado).subscribe({
            next: () => this.cargarProductos()
        });
    }

    campoInvalido(campo: string): boolean {
        const c = this.form.get(campo);
        return !!(c?.invalid && c?.touched);
    }
}
