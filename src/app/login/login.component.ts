import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import Swal from 'sweetalert2';  // Importa SweetAlert2

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',  // O 'bottom-end'
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';  // Inicializamos la propiedad username
  password: string = '';  // Inicializamos la propiedad password

  constructor(private router: Router, private http: HttpClient) { }

  logeo() {
    const loginData = {
      username: this.username,
      password: this.password
    };

    // Hacer la solicitud POST para autenticar el usuario
    this.http.post('https://eaapc.com:3000/api/datos/login', loginData).subscribe(
      (response: any) => {
        // Si la autenticación es exitosa, guardamos el token
        if (response.success) {
          localStorage.setItem('token', response.token);  // Guardar token en localStorage
          this.router.navigate(['/dashboard']);  // Redirigir a la pantalla de dashboard
          Toast.fire({
            icon: 'success',
            title: '¡Login exitoso! Bienvenido de nuevo.'
          });
          // Mostrar un mensaje de éxito con SweetAlert2

        } else {
          console.error('Login fallido', response.error);

          // Mostrar un mensaje de error con SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.error || 'Hubo un error en el login. Intenta nuevamente.',
            showConfirmButton: true
          });
        }
      },
      (error) => {
        console.error('Error en el login', error);

        // Mostrar un mensaje de error con SweetAlert2
        Swal.fire({
          icon: 'info',
          title: 'Error',
          text: 'Usuario o contraseña incorrectos.',
          showConfirmButton: true
        });
      }
    );
  }
}
