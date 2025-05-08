import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductosService } from '../service/productos/productos.service';
import { ProductoEditComponent } from '../producto-edit/producto-edit.component';
import { ConfirmacionComponent } from '../confirmacion/confirmacion.component';
import { NuevoProductoComponent } from '../nuevo-producto/nuevo-producto.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TokenService } from '../service/token.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { IoService } from '../service/io.service';  // Asegúrate de tener este servicio para la comunicación de Socket.IO
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-historico',
  imports: [CommonModule, NgbModule, MatPaginatorModule,
    MatTableModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatProgressSpinnerModule, MatSelectModule,
    FormsModule],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.css'
})
export class HistoricoComponent {
  products: any[] = [];
  currentDate = new Date();
  datoInicio = 'CO';
  currentYear = this.currentDate.getFullYear() ;
  currentMonth = this.currentDate.getMonth() + 1;
  isLoading = false;
  userLogeado = '';
  months = [
    { number: 1, name: 'Enero' },
    { number: 2, name: 'Febrero' },
    { number: 3, name: 'Marzo' },
    { number: 4, name: 'Abril' },
    { number: 5, name: 'Mayo' },
    { number: 6, name: 'Junio' },
    { number: 7, name: 'Julio' },
    { number: 8, name: 'Agosto' },
    { number: 9, name: 'Septiembre' },
    { number: 10, name: 'Octubre' },
    { number: 11, name: 'Noviembre' },
    { number: 12, name: 'Diciembre' }
  ];  
  years = [2023, 2024, 2025];
  searchQuery: string = '';
  
  // Variable para mantener los usuarios que están editando los productos
  editingUsers: { [key: string]: string } = {};

  displayedColumns: string[] = ['nro_expediente','usuario', 'fecha_ingreso', 'estado', 'materia', 'monto', 'telefono', 'acciones'];
  dataSource = new MatTableDataSource<any>();
  selectedMonth: number = this.currentMonth;
  selectedYear: number = this.currentYear;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private productService: ProductosService,
    private modalService: NgbModal,
    private router: Router,
    private socketService: IoService  // Servicio de Socket.IO
  ) {}

  ngOnInit(): void {
    if (!TokenService.isTokenValid()) {
      this.router.navigate(['/login']);
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken: any = jwtDecode(token);
        console.log(decodedToken)
        this.userLogeado = decodedToken.username;
        if(this.userLogeado == 'tioefe'){
          this.loadProductsInicio()
        }
        else{
          this.router.navigate(['/dashboard']);
        }
 // Escuchar cambios de edición en tiempo real
      }
      
    }
  }
  logout() {
    TokenService.logout(); // Destruir sesión
  }
  applyFilters2(): void {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
    if (!this.searchQuery) {
      this.dataSource.filter = '';
    }
  }
  applyFilters() {
    this.isLoading = true;
    this.productService.getProducts(this.datoInicio, this.selectedYear, this.selectedMonth).subscribe(
      (data: any[]) => {
        this.products = data;
        this.dataSource.data = data;
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
        console.error('Error fetching products', error);
      }
    );
  }
  handleButtonClick(value: string): void {
    this.router.navigate(['/dashboard']);
  }
  obtenerHistorico(): void {
    this.router.navigate(['/historico']);
  }
  loadProductsInicio(): void {
    this.isLoading = true;
    this.productService.getHistorico(this.currentYear, this.currentMonth).subscribe(
      (data: any[]) => {
        this.products = data;
        this.dataSource.data = data;
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
        console.error('Error fetching products', error);
      }
    );
  }
}
