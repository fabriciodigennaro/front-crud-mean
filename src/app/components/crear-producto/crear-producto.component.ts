import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css'],
})
export class CrearProductoComponent implements OnInit, OnDestroy {
  productoForm: FormGroup;
  titulo = 'Crear producto';
  id: string | null;
  subscriptions: Subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private productoService: ProductoService,
    private aRouter: ActivatedRoute
  ) {
    this.productoForm = this.fb.group({
      producto: ['', Validators.required],
      categoria: ['', Validators.required],
      ubicacion: ['', Validators.required],
      precio: ['', Validators.required],
    });
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  agregarProducto(): void {
    const PRODUCTO: Producto = {
      nombre: this.productoForm.get('producto')?.value,
      categoria: this.productoForm.get('categoria')?.value,
      ubicacion: this.productoForm.get('ubicacion')?.value,
      precio: this.productoForm.get('precio')?.value,
    };

    if (this.id !== null) {
      this.subscriptions.add(
        // editamos producto
        this.productoService.editarProducto(this.id, PRODUCTO).subscribe(
          (data) => {
            this.router.navigate(['/']);
          },
          (error) => {
            console.log(error);
            this.productoForm.reset();
          }
        )
      );
    } else {
      this.subscriptions.add(
        //  agregamos producto
        this.productoService.guardarProducto(PRODUCTO).subscribe(
          (data) => {
            this.toastr.success(
              'El producto fue registrado con exito!',
              'Producto Registrado!'
            );
            this.router.navigate(['/']);
          },
          (error) => {
            console.log(error);
            this.productoForm.reset();
          }
        )
      );
    }
  }

  esEditar(): void {
    if (this.id !== null) {
      this.titulo = 'Editar producto';
      this.subscriptions.add(
        this.productoService.obtenerProducto(this.id).subscribe((data) => {
          this.productoForm.setValue({
            producto: data.nombre,
            categoria: data.categoria,
            ubicacion: data.ubicacion,
            precio: data.precio,
          });
        })
      );
    }
  }
}
