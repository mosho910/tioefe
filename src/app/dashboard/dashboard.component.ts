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
import { MatCheckboxModule } from '@angular/material/checkbox';  // Importa MatCheckboxModule
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgbModule, MatPaginatorModule,
    MatTableModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatProgressSpinnerModule, MatSelectModule,
    FormsModule,MatCheckboxModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  products: any[] = [];
  currentDate = new Date();
  datoInicio = 'CO';
  currentYear = this.currentDate.getFullYear() ;
  currentMonth = this.currentDate.getMonth() ;
  isLoading = false;
  userLogeado = '';
  editingProductId: string | null = null; 
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
  selectedCiudad: string = "18"; // Código de Lima

  distritosJudiciales = [
    { codigo: "01", descripcion: "AMAZONAS" },
    { codigo: "02", descripcion: "ANCASH" },
    { codigo: "03", descripcion: "APURIMAC" },
    { codigo: "04", descripcion: "AREQUIPA" },
    { codigo: "05", descripcion: "AYACUCHO" },
    { codigo: "06", descripcion: "CAJAMARCA" },
    { codigo: "07", descripcion: "CALLAO" },
    { codigo: "08", descripcion: "CAÑETE" },
    { codigo: "50", descripcion: "CORTE SUPERIOR NACIONAL DE JUSTICIA PENAL ESPECIALIZADA" },
    { codigo: "10", descripcion: "CUSCO" },
    { codigo: "25", descripcion: "DEL SANTA" },
    { codigo: "11", descripcion: "HUANCAVELICA" },
    { codigo: "12", descripcion: "HUANUCO" },
    { codigo: "13", descripcion: "HUAURA" },
    { codigo: "14", descripcion: "ICA" },
    { codigo: "15", descripcion: "JUNIN" },
    { codigo: "16", descripcion: "LA LIBERTAD" },
    { codigo: "17", descripcion: "LAMBAYEQUE" },
    { codigo: "18", descripcion: "LIMA" },
    { codigo: "32", descripcion: "LIMA ESTE" },
    { codigo: "09", descripcion: "LIMA NORTE" },
    { codigo: "30", descripcion: "LIMA SUR" },
    { codigo: "19", descripcion: "LORETO" },
    { codigo: "27", descripcion: "MADRE DE DIOS" },
    { codigo: "28", descripcion: "MOQUEGUA" },
    { codigo: "29", descripcion: "PASCO" },
    { codigo: "20", descripcion: "PIURA" },
    { codigo: "33", descripcion: "PUENTE PIEDRA - VENTANILLA" },
    { codigo: "21", descripcion: "PUNO" },
    { codigo: "22", descripcion: "SAN MARTIN" },
    { codigo: "34", descripcion: "SELVA CENTRAL" },
    { codigo: "31", descripcion: "SULLANA" },
    { codigo: "23", descripcion: "TACNA" },
    { codigo: "26", descripcion: "TUMBES" },
    { codigo: "24", descripcion: "UCAYALI" }
  ];
  
  searchQuery: string = '';
  
  // Variable para mantener los usuarios que están editando los productos
  editingUsers: { [key: string]: string } = {};

  displayedColumns: string[] = ['nro_expediente', 'fecha_ingreso', 'estado', 'materia', 'monto', 'telefono', 'acciones'];
  dataSource = new MatTableDataSource<any>();
  selectedMonth: number = this.currentMonth;
  selectedYear: number = this.currentYear;
  selectedInstancia: string = 'JR';

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private productService: ProductosService,
    private modalService: NgbModal,
    private router: Router,
    private socketService: IoService,
    private snackBar: MatSnackBar,
    private ioService: IoService
  ) {}

  ngOnInit(): void {
    if (!TokenService.isTokenValid()) {
      this.router.navigate(['/login']);
    } else {
      const token = localStorage.getItem('token');
      console.log(token)
      if (token) {
        const decodedToken: any = jwtDecode(token);
        this.userLogeado = decodedToken.username;
        this.loadProductsInicio();
        this.listenToEditingChanges(); // Escuchar cambios de edición en tiempo real
        this.ioService.onProductUpdated((updatedProduct: any) => {
          console.log('Producto actualizado recibido:', updatedProduct);
          this.updateProductInDashboard(updatedProduct);
        });
      }
  
      // Limpiar estado de edición al cargar
      const editingProduct = Object.keys(localStorage).find(key => key.startsWith('editing-'));
      if (editingProduct) {
        // Llamar a stopEditing para detener la edición si se recarga la página
        const productId = editingProduct.replace('editing-', '');
        this.stopEditing(productId);
      }
    }
  }
  
  updateProductInDashboard(updatedProduct: any) {
    // Lógica para actualizar el producto en el dashboard
    console.log(updatedProduct.nro_expediente);
    console.log(this.products);
  
    const index = this.products.findIndex(p => p.nro_expediente === updatedProduct.nro_expediente);
    
    if (index !== -1) {
      console.log("Producto encontrado, actualizando...");
      this.products[index] = updatedProduct;
      this.dataSource.data = this.products
    } else {
      console.log("Producto no encontrado, agregando nuevo...");
      this.products.push(updatedProduct);
      this.dataSource.data = this.products
    }
  }
  
  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  // Función que escucha los cambios en el estado de edición
  listenToEditingChanges() {
    console.log("escuchando usuariossss")
    this.socketService.onEditingStatusChange((editingUsers: any) => {
      console.log('Usuarios editando: ', editingUsers);  // Verifica en consola si este evento se está recibiendo
      this.editingUsers = editingUsers;  // Actualiza el estado de los usuarios que están editando
    });
  }

  handleButtonClick(value: string): void {
    this.isLoading = true;
    this.datoInicio = value;
    this.productService.getProducts(value, this.selectedYear, this.selectedMonth).subscribe(
      (data: any[]) => {
        // Filtrar los productos según la lógica del cuarto bloque
        this.products = data.filter(product => {
          // Obtener el bloque del nro_expediente
          const nroExpedienteBlocks = product.nro_expediente.split('-');
          
          // Verificar si los dos primeros caracteres del cuarto bloque son "18"
          return nroExpedienteBlocks[3].slice(0, 2) === this.selectedCiudad;
        });
  
        // Asignar los productos filtrados a la fuente de datos
        this.dataSource.data = this.products;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error fetching products', error);
        this.isLoading = false;
      }
    );
  }
  
  obtenerHistorico(): void {
    this.router.navigate(['/historico']);
  }
  

  loadProductsInicio(): void {
    this.isLoading = true;
  
    this.productService.getProducts(this.datoInicio, this.currentYear, this.currentMonth).subscribe(
      (data: any[]) => {
        this.products = data.filter(product => {
          const bloques = product.nro_expediente.split('-');
  
          // Validamos que haya al menos 5 bloques
          if (bloques.length < 5) return false;
  
          const ciudadOk = this.selectedCiudad ? bloques[3].slice(0, 2) === this.selectedCiudad : true;
          const instanciaOk = this.selectedInstancia ? bloques[4] === this.selectedInstancia : true;
  
          return ciudadOk && instanciaOk;
        });
  
        this.dataSource.data = this.products;
        console.log(this.dataSource.data);
  
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
        console.error('Error fetching products', error);
      }
    );
  }
  


  createProduct(): void {
    const modalRef = this.modalService.open(NuevoProductoComponent);
    modalRef.result.then((result) => {
      if (result) {
        this.productService.createProduct(result).subscribe(() => {
          this.loadProductsInicio();
        });
      }
    }).catch((error) => {
      console.log('Modal dismissed:', error);
    });
  }

  editProduct(product: any): void {
    // Primero, verificamos si el producto ya está siendo editado
    if (this.isEditing(product) && this.editingUsers[product.nro_expediente] !== this.userLogeado) {
      alert('Este expediente ya está siendo editado por otro usuario.');
      return;  // No abrir el modal si otro usuario lo está editando
    }
    
    // Emitir el evento de 'startEditing' cuando se comienza a editar un producto
    this.startEditing(product.nro_expediente);  // Emite el evento de inicio de edición

    // Abrir el modal de edición
    const modalRef = this.modalService.open(ProductoEditComponent, { size: 'lg' });
    modalRef.componentInstance.product = { ...product };
    modalRef.componentInstance.user = this.userLogeado;
    

    // Cuando se cierra el modal, se maneja el resultado
    modalRef.result.then((result) => {
      if (result) {

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
          this.stopEditing(product.nro_expediente);

      }
    }).catch((error) => {
      this.stopEditing(product.nro_expediente);
      console.log('Modal dismissed:', error);
    });
  }
  
  isEditing(element: any): boolean {
    return this.editingUsers[element.nro_expediente] !== undefined;
  }
  startEditing(recordId: string): void {
    localStorage.setItem(`editing-${recordId}`, this.userLogeado);  // Guardar quién está editando
    this.socketService.startEditing(recordId, this.userLogeado);
  }

  stopEditing(recordId: string): void {
    localStorage.removeItem(`editing-${recordId}`);  // Eliminar del localStorage
    this.socketService.stopEditing(recordId);
  }

  deleteProduct(product: any): void {
    const modalRef = this.modalService.open(ConfirmacionComponent);
    modalRef.result.then((result) => {
      if (result) {
        this.productService.deleteProduct(product.id).subscribe(() => {
          this.loadProductsInicio();
        });
      }
    }).catch((error) => {
      console.log('Modal dismissed:', error);
    });
  }
  

  // Aplicar filtros de búsqueda
  applyFilters(): void {
    this.isLoading = true;
    this.productService.getProducts(this.datoInicio, this.selectedYear, this.selectedMonth).subscribe(
      (data: any[]) => {
        this.products = data.filter(product => {
          const bloques = product.nro_expediente.split('-');
  
          // Validamos que haya suficientes bloques antes de acceder
          if (bloques.length < 5) return false;
  
          const ciudadOk = this.selectedCiudad ? bloques[3].slice(0, 2) === this.selectedCiudad : true;
          const instanciaOk = this.selectedInstancia ? bloques[4] === this.selectedInstancia : true;
  
          return ciudadOk && instanciaOk;
        });
  
        this.dataSource.data = this.products;
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
        console.error('Error fetching products', error);
      }
    );
  }
  
  

  applyFilters2(): void {
    // Normalizamos la búsqueda
    const normalizedQuery = this.searchQuery.trim().toLowerCase();
    
    // Si la consulta está vacía, salimos de la función
    if (normalizedQuery === '') {
      return;
    }
  
    // Establecemos el estado de carga a true
    this.isLoading = true;
  
    // Realizamos la primera llamada para obtener el expediente
    this.productService.buscarPorDemandado(normalizedQuery).subscribe(
      (data1: any) => {
        // Cuando obtenemos la respuesta de getExpediente, dejamos de mostrar el loading
        console.log(data1);
        if (Array.isArray(data1) && data1.length === 0) {
          // Si el arreglo está vacío
          this.isLoading = false;
          alert('No se encontro expediente')
          return
        }
        this.dataSource.data = data1;
        this.products = data1;  // Asignamos los resultados a la lista de productos
        this.isLoading = false;
        // Mostrar la fecha de ingreso y convertirla a un objeto Date
        console.log(data1);
  
      },
      (error: any) => {
        this.isLoading = false;
        console.error('Error fetching expediente', error);
      }
    );
  }
  
  

  logout() {
    TokenService.logout(); // Destruir sesión
  
    // Detener la edición en tiempo real
    const editingProduct = Object.keys(localStorage).find(key => key.startsWith('editing-'));
    if (editingProduct) {
      const productId = editingProduct.replace('editing-', '');
      this.stopEditing(productId); // Llamar a stopEditing para dejar de editar
    }
  
    // Redirigir al login o realizar cualquier otra acción
    this.router.navigate(['/login']);
  }
  
  
  
  applyFilters3(): void {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
    if (!this.searchQuery) {
      this.dataSource.filter = '';
    }
    
  }
  navegarAPagina(pagina: number): void {
    this.paginator.pageIndex = pagina - 1; // Ajuste del índice (0-basado)
    this.paginator._changePageSize(this.paginator.pageSize); // Asegúrate de que el paginator se refresque con el nuevo índice
  
    // Esto puede ser útil si tu paginador necesita actualizar la visualización de la página
    // Llamamos explícitamente al evento de "page" para forzar la actualización de los datos
    this.paginator.page.emit({
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      length: this.dataSource.data.length
    });
  }

  editRow(row: any): void {
    // Verificar si el producto está siendo editado por otro usuario
    if (this.isEditing(row) && this.editingUsers[row.nro_expediente] !== this.userLogeado) {
      alert('Este expediente ya está siendo editado por otro usuario.');
      return;  // No permitir la edición si otro usuario lo está editando
    }
  
    // Si no está siendo editado por otro usuario, entonces proceder a la edición
    if (this.editingProductId && this.editingProductId !== row.nro_expediente) {
      this.stopEditingById(this.editingProductId);  // Detener la edición del expediente anterior
    }
  
    // Activar la edición de esta fila
    this.startEditing(row.nro_expediente);
  
    // Establecer el nuevo expediente como el actualmente editado
    this.editingProductId = row.nro_expediente;
  }
  
  
  stopEditingById(recordId: string): void {
    // Eliminar el registro del localStorage
    localStorage.removeItem(`editing-${recordId}`);
    
    // Detener la edición en el socket (si es necesario)
    this.socketService.stopEditing(recordId);
  
    // Limpiar el ID del expediente editado
    if (this.editingProductId === recordId) {
      this.editingProductId = null;
    }
  }
  
  onLeftClick(event: MouseEvent, nroExpediente: string): void {
    event.preventDefault();  // Prevenir el comportamiento predeterminado

    // Crear un campo de texto invisible para copiar el contenido
    const textarea = document.createElement('textarea');
    textarea.value = nroExpediente;
    document.body.appendChild(textarea);
    textarea.select();  // Seleccionar el texto
    const successful = document.execCommand('copy');  // Copiar al portapapeles
    document.body.removeChild(textarea);  // Eliminar el campo de texto

    // Mostrar un mensaje con MatSnackBar si la copia fue exitosa
    if (successful) {
      this.snackBar.open(`¡Número de expediente ${nroExpediente} copiado!`, 'Cerrar', {
        duration: 3000,  // Duración en milisegundos (3 segundos)
        panelClass: ['success-snackbar'],  // Clase personalizada para el estilo
      });
    } else {
      this.snackBar.open('Error al copiar el número de expediente', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar'],  // Clase personalizada para el estilo
      });
    }
  }
  clearSearch(): void {
    this.searchQuery = '';  // Limpiar la consulta de búsqueda
    this.applyFilters();  // Aplicar los filtros para actualizar la vista
  }
  

}
