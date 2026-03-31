import { Component, OnInit, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../../model/producto.model';

@Component({
    selector: 'app-gestion-productos',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule],
    templateUrl: './gestion-productos.html',
    styleUrls: ['./gestion-productos.css']
})
export class GestionProductosComponent implements OnInit {
    private productoService = inject(ProductoService);
    private fb = inject(FormBuilder);

    productos = signal<Producto[]>([]);
    cargando = signal(true);
    error = signal('');
    modoFormulario = signal<'cerrado' | 'nuevo' | 'editar'>('cerrado');
    productActual = signal<Producto | null>(null);
    guardando = signal(false);
    mensajeExito = signal('');

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
    }

    cerrarFormulario() {
        this.modoFormulario.set('cerrado');
        this.form.reset();
    }

    guardar() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
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
