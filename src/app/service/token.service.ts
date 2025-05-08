// token.service.ts
export class TokenService {

    static isTokenValid(): boolean {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;  // Si no hay token, lo consideramos inválido
      }
  
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          // Decodificar el payload
          const decodedPayload = JSON.parse(atob(tokenParts[1]));
          const expirationTime = decodedPayload.exp;
          const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
  
          // Verificar si el token ha expirado
          return expirationTime > currentTime;
        }
      } catch (error) {
        console.error('Error al verificar el token', error);
      }
  
      return false;  // Si no se pudo verificar, consideramos que el token es inválido
    }
    static logout(): void {
        localStorage.removeItem('token');  // Eliminamos el token
        // Aquí puedes redirigir al usuario al login si lo deseas
        window.location.href = '/';  // Redirige al login (puedes usar router.navigate en Angular)
      }
  }
  