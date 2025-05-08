import { Component } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirmacion',
    imports: [],
    templateUrl: './confirmacion.component.html',
    styleUrl: './confirmacion.component.css'
})
export class ConfirmacionComponent {
  constructor(public activeModal: NgbActiveModal) {}

  confirmDelete(): void {
    this.activeModal.close(true);
  }

  cancel(): void {
    this.activeModal.dismiss(false);
  }
}
