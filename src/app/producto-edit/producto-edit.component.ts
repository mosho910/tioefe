import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../service/productos/productos.service';
import Swal from 'sweetalert2';
import { error } from 'jquery';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { IoService } from '../service/io.service';


@Component({
    selector: 'app-producto-edit',
    imports: [CommonModule, FormsModule, NgbModule,MatProgressSpinnerModule],
    templateUrl: './producto-edit.component.html',
    styleUrl: './producto-edit.component.css'
})
export class ProductoEditComponent {
  @Input() product: any;
  @Input() user: any;
  isLoading = false;
  paterno: string = '';
  materno: string = '';
  nombres: string = '';
  constructor(public activeModal: NgbActiveModal,
    private productService: ProductosService, 
    private ioService: IoService,  // Inyectamos el IoService

  ) {}
  ngOnInit(): void {
    // Establece un color predeterminado si no está definido
    if (this.product.color != null) {
      this.setColor('#'+this.product.color)
    }
  }

  saveChanges(): void {
    console.log(this.user)
    // Llamada al servicio para actualizar el producto
    this.productService.updateProduct(this.product.id, this.product,this.user).subscribe(
      (response) => {
        console.log("2")
        console.log('Producto actualizado con éxito:', response);
  
        // Mostrar una alerta de éxito utilizando SweetAlert2
        Swal.fire({
          title: '¡Éxito!',
          text: 'Expediente actualizado con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
        this.ioService.emitProductUpdated(this.product);

        // Cerrar el modal y devolver el producto actualizado
        this.activeModal.close(this.product);
      },
      (error) => {
        console.error('Error al actualizar el producto:', error);
  
        // Mostrar una alerta de error utilizando SweetAlert2
        Swal.fire({
          title: 'Error',
          text: 'Error al actualizar el expediente. Por favor, intenta de nuevo.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
        });
      }
    );
  }
  setColor(color: string): void {
    this.product.selectedColor = color;
  }
  getDemandadosValue() {
    console.log('Valor de Nombres:', this.product.demandados);
  
    // Verificar si demandados contiene una coma antes de intentar dividirlo
    if (!this.product.demandados || !this.product.demandados.includes(',')) {
      console.error('El valor de "demandados" no tiene el formato esperado');
      return;
    }
  
    // Separar los apellidos de los nombres usando la coma
    const [apellidos, nombres] = this.product.demandados.split(',');
  
    // Asignar el valor a la variable nombres
    this.nombres = nombres.trim();  // Eliminar espacios extra al principio y al final
  
    // Separar los apellidos en paterno y materno
    const apellidosArray = apellidos.trim().split(' ');  // Separar en partes por espacio
    if (apellidosArray.length >= 2) {
      this.paterno = apellidosArray[0];  // Primer palabra es el apellido paterno
      this.materno = apellidosArray[1];  // Segunda palabra es el apellido materno
    } else {
      // Si no hay apellido materno, asignamos el valor solo al apellido paterno
      this.paterno = apellidosArray[0];
      this.materno = '';
    }
  
    // Mostrar el resultado
    console.log('Paterno:', this.paterno);
    console.log('Materno:', this.materno);
    console.log('Nombres:', this.nombres);
    this.isLoading = true;
    // Enviar los datos a la API
    this.productService.enviarDatos(this.nombres, this.paterno, this.materno).subscribe(
      (res) => {
        this.isLoading = false;
        console.log(res);
        if (res.resultados && res.resultados.length === 1) {
          // Suponiendo que "setear dni" es una acción para asignar el DNI
          const dni = res.resultados[0].numero;  // Obtener el DNI de la respuesta
          console.log('DNI:', dni);
  
          // Aquí puedes asignar el DNI a alguna variable o propiedad
          this.product.dni = dni;  // Asumiendo que 'product.dni' es la propiedad donde quieres guardar el DNI
        } else {
          this.isLoading = false;
          console.error('No se encontraron resultados o los resultados no son correctos');
        }
      },
      (error) => {
        console.error('Error al enviar los datos:', error);
      }
    );
  }
  
}