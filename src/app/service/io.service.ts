import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class IoService {
  private socket: any;

  constructor() {
    // Conectar con tu servidor Node.js
    //
    this.socket = io('https://eaapc.com:3000'); // Asegúrate de que la URL sea correcta
    console.log("Conectando al servidor de Socket.IO...");

    // Verificar la conexión con Socket.IO
    this.socket.on('connect', () => {
      console.log('Conectado a Socket.IO');
    });

    // Verificar si hay algún error en la conexión
    this.socket.on('connect_error', (error: any) => {
      console.log('Error de conexión a Socket.IO:', error);
    });
  }

  // Suscribir a la actualización del estado de edición
  onEditingStatusChange(callback: (editingUsers: any) => void) {
    this.socket.on('updateEditingStatus', (editingUsers: any) => {
      console.log('Usuarios editando:', editingUsers);  // Ver si se recibe correctamente
      callback(editingUsers);
    });
  }

  // Enviar evento de inicio de edición
  startEditing(recordId: string, user: string) {
    this.socket.emit('startEditing', recordId, user);
    console.log(`Usuario ${user} ha empezado a editar el registro ${recordId}`);
  }

  // Enviar evento de fin de edición
  stopEditing(recordId: string) {
    this.socket.emit('stopEditing', recordId);
    console.log(`Se ha detenido la edición del registro ${recordId}`);
  }
  emitProductUpdated(product: any) {
    this.socket.emit('productUpdated', product);
    console.log(`Producto actualizado: ${product.id}`);
  }
  onProductUpdated(callback: (updatedProduct: any) => void) {
    this.socket.on('productUpdated', callback);
  }
}
