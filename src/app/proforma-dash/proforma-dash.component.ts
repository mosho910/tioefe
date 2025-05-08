import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProformaAddModalComponent } from '../proforma-add-modal/proforma-add-modal.component';

@Component({
    selector: 'app-proforma-dash',
    imports: [CommonModule],
    templateUrl: './proforma-dash.component.html',
    styleUrl: './proforma-dash.component.css'
})
export class ProformaDashComponent {
  constructor(private modalService: NgbModal) {}
  products: any[] = [];
  openProformaModal() {
    const modalRef = this.modalService.open(ProformaAddModalComponent, { size: 'xl' }); // 'lg' para grande, 'xl' para extra grande
    modalRef.result.then((result) => {
      if (result) {
        console.log('Proforma creada:', result);
        // Lógica adicional si es necesario
      }
    }).catch((error) => {
      console.log('Modal dismissed:', error);
    });
  }
}
