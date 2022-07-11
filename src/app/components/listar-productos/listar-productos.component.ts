import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-listar-productos',
  templateUrl: './listar-productos.component.html',
  styleUrls: ['./listar-productos.component.css'],
})
export class ListarProductosComponent implements OnInit, OnDestroy {
  listProductos: Producto[] = [];
  subscriptions: Subscription = new Subscription();

  constructor(
    private productoService: ProductoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  obtenerProductos(): void {
    this.subscriptions.add(
      this.productoService.getProductos().subscribe(
        (data) => {
          console.log(data);
          this.listProductos = data;
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }

  eliminarProducto(id: any): void {
    this.subscriptions.add(
      this.productoService.eliminarProducto(id).subscribe(
        (data) => {
          this.toastr.error(
            'El producto fue eliminado con exito',
            'Producto Eliminado'
          );
          this.obtenerProductos();
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }
}
