import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../service/productos/productos.service';
import { ProductoModel } from '../models/productoModel'

interface Product {
  id: number;
  descripcion: string;
  precio_u: number;
  rendimiento: number;
  selected:boolean;
}

@Component({
    selector: 'app-product-kit-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './product-kit-modal.component.html',
    styleUrls: ['./product-kit-modal.component.css']
})
export class ProductKitModalComponent implements OnInit {
  @Input() products: ProductoModel[] = [];
  kitName: string = '';
  searchTerm: string = '';
  kitQuantity: number = 1; // Cantidad de kits
  finalAmount: number = 0; // Monto final

  constructor(public activeModal: NgbActiveModal, private productService: ProductosService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts('1',1,1).subscribe(
      (data: ProductoModel[]) => {
        this.products = data.map(product => ({
          ...product,
          precio_u: typeof product.precio_u === 'string' ? parseFloat(product.precio_u) : product.precio_u
        }));
      },
      error => {
        console.error('Error fetching products', error);
      }
    );
  }
  
  

  filteredProducts(): ProductoModel[] {
    const normalizedSearchTerm = this.searchTerm.toLowerCase();
  
    return this.products.filter(product =>
      product.descripcion.toLowerCase().includes(normalizedSearchTerm) ||
      product.id.toString().toLowerCase().includes(normalizedSearchTerm)
    );
  }
  
  

  saveKit() {
    const selectedProducts = this.products.filter(p => p.selected);
    if (selectedProducts.length > 0 && this.kitName.trim()) {
      const kit = {
        nombre: this.kitName,
        productos: selectedProducts,
        cantidad: this.kitQuantity
      };
      this.activeModal.close(kit);
    } else {
      alert('Debe ingresar un nombre para el kit y seleccionar al menos un producto.');
    }
  }
  calculateTotalPrice() {
    return this.products
      .filter(product => product.selected)
      .reduce((total, product) => total + product.precio_u, 0);
  }
  updateTotalPrice() {
    // Este método es opcional ya que Angular recalculará el total automáticamente
    // cuando se modifica `product.selected`, pero se puede mantener por claridad.
    this.calculateTotalPrice();
  }
  updateFinalAmount(): void {
    const total = this.calculateTotalPrice();
    this.finalAmount = total * this.kitQuantity;
  }
}
