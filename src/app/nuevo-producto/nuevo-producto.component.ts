import { Component } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-nuevo-producto',
    imports: [CommonModule, FormsModule, NgbModule],
    templateUrl: './nuevo-producto.component.html',
    styleUrl: './nuevo-producto.component.css'
})
export class NuevoProductoComponent {
  product: any = {
    descripcion: '',
    precio_u: 0,
    rendimiento: ''
  };

  constructor(public activeModal: NgbActiveModal) {}

  saveChanges(): void {
    this.activeModal.close(this.product);
  }
}
