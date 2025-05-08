import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductKitModalComponent } from '../product-kit-modal/product-kit-modal.component';

interface Product {
  id: number;
  name: string;
  selected: boolean;
}

interface Kit {
  id: number;
  nombre: string;
  productos: Product[];
  cantidad:number;
}

@Component({
    selector: 'app-proforma-add-modal',
    imports: [CommonModule, FormsModule, NgbModule],
    templateUrl: './proforma-add-modal.component.html',
    styleUrls: ['./proforma-add-modal.component.css']
})
export class ProformaAddModalComponent {
  proforma = {
    cliente: '',
    empresa: '',
    ruc: '',
    ubicacion: '',
    proyecto: '',
    presupuesto: '',
    moneda: '',
    contacto: '',
    kits: [] as Kit[]
  };


  selectedKit: number | null = null;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal) {}


  removeKit(kit: Kit) {
    this.proforma.kits = this.proforma.kits.filter(k => k !== kit);
  }

  saveChanges() {
    console.log(this.proforma);
  }
  addKit() {
    const modalRef = this.modalService.open(ProductKitModalComponent, { size: 'lg' }); // 'lg' para grande, 'xl' para extra grande
    modalRef.result.then((result: Kit) => { // Asegúrate de que el tipo de 'result' sea Kit
      if (result) {
        this.proforma.kits.push(result); // Añadir el kit al array de kits en el objeto proforma
        console.log('Proforma creada:', result);
        // Lógica adicional si es necesario
      }
    }).catch((error) => {
      console.log('Modal dismissed:', error);
    });
  }
  
}
