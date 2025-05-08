import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataTablesModule } from 'angular-datatables'; // Importa el módulo de DataTables
import { MatTableModule } from '@angular/material/table';  // Importar MatTableModule
import { MatButtonModule } from '@angular/material/button'; // Si necesitas botones Material
import { MatPaginatorModule } from '@angular/material/paginator'; // Si usas paginación
import { MatSortModule } from '@angular/material/sort'; // Si usas ordenación de columnas
import { MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HttpClientModule,DataTablesModule,
      MatTableModule,MatButtonModule,MatPaginatorModule,MatSortModule,MatSnackBarModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bloques';
}
