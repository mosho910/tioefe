import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoModel } from '../../models/productoModel'

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'https://eaapc.com:3000/api/datos';  // Cambiar http por https


  constructor(private http: HttpClient) { }

  getProducts(tipo_estado: string, anio: number, mes: number): Observable<ProductoModel[]> {
    // Crear los parámetros de la URL
    const params = new HttpParams()
      .set('tipo_estado', tipo_estado)
      .set('anio', anio.toString())
      .set('mes', mes.toString());

    // Realizar la solicitud GET con los parámetros
    return this.http.get<ProductoModel[]>(this.apiUrl, { params });
  }
  getHistorico( anio: number, mes: number): Observable<ProductoModel[]> {
    // Crear los parámetros de la URL
    const params = new HttpParams()
      .set('anio', anio.toString())
      .set('mes', mes.toString());

    // Realizar la solicitud GET con los parámetros
    return this.http.get<ProductoModel[]>(`${this.apiUrl}/historico`, { params });
  }

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  updateProduct(id: number, product: any, user: string): Observable<any> {
    // Quitar el '#' del color seleccionado
    const colorWithoutHash = product.selectedColor.replace('#', '');
  
    const payload = {
      ...product,
      color: colorWithoutHash,  // Asigna el color sin el '#'
    };
  
    return this.http.put<any>(`${this.apiUrl}/editar/${id}/${user}`, payload);
  }
  
  

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  getExpediente(nro_expediente: string): Observable<ProductoModel[]> {
    // Crear los parámetros de la URL
    const params = new HttpParams()
      .set('nro_expediente', nro_expediente)

    // Realizar la solicitud GET con los parámetros
    return this.http.get<ProductoModel[]>(`${this.apiUrl}/expediente`, { params });
  }
  buscarPorDemandado(demandado: string): Observable<ProductoModel[]> {
    const body = { demandado };
  
    return this.http.post<ProductoModel[]>(
      `${this.apiUrl}/buscar-por-demandado`,
      body
    );
  }
  
  enviarDatos(nombres: string, apellido_paterno: string, apellido_materno: string): Observable<any> {
    const body = { nombres, apellido_paterno, apellido_materno };

    // Configuración de los encabezados (opcional)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'  // Asegúrate de que el contenido sea JSON
    });

    // Realizamos la solicitud POST a la API
    return this.http.post<any>(`${this.apiUrl}/dni`, body, { headers });
  }
}
