import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; 
import { isPlatformBrowser } from '@angular/common'; // Importar la función de verificación de plataforma
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Router } from '@angular/router'; 
import { BehaviorSubject, Observable } from 'rxjs'; 
import { map } from 'rxjs/operators'; 
import { environment } from '../../../environments/environment';

@Injectable({ 
 providedIn: 'root', 
}) 
export class AuthService { 
 private token = new BehaviorSubject<string | null>(null); 
 private isBrowser: boolean; // Propiedad para guardar si estamos en el navegador
 
 constructor(
    private http: HttpClient, 
    private router: Router,
    // 🔥🔥 INYECTAR PLATFORM_ID 🔥🔥
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Determinar si estamos en el navegador o en el servidor
    this.isBrowser = isPlatformBrowser(this.platformId);

    // 🔥🔥 CORRECCIÓN CLAVE: Solo acceder a localStorage si es el navegador 🔥🔥
    if (this.isBrowser) {
        const initialToken = localStorage.getItem('token');
        if (initialToken) {
            this.token.next(initialToken); // Inicializa el BehaviorSubject con el token guardado
        }
    }
} 
 
 /**   * Método para autenticar al usuario. 
  * @param username - Nombre de usuario ingresado. 
  * @param password - Contraseña ingresada. 
  * @returns Observable que emite un objeto con el token de autenticación si la 
solicitud es exitosa. 
  */ 
 login(username: string, password: string): Observable<{ token: string }> { 
   return this.http.post<{ token: string }>( 
     `${environment.apiUrl}/v1/authenticate`, 
     { username, password }, 
     { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) } 
   ); 
 } 
 
 /**   * Almacena el token de autenticación en el BehaviorSubject. 
  * @param token - Token recibido tras una autenticación exitosa. 
  */ 
 setToken(token: string): void { 
   this.token.next(token); // Actualiza el valor del token. 
    if (this.isBrowser) {
      localStorage.setItem('token', token); // 💾 guarda el token
    }
 } 
 
 /**   * Obtiene el token actual almacenado en el BehaviorSubject. 
  * @returns El token actual o null si no está definido. 
  */ 
// En el Canvas Auth Service Corregido:
// En el Auth Service Corregido:
 getToken(): string | null {
  // 🔥 AJUSTE: Si el BehaviorSubject es null, intenta leer de localStorage por si acaso
  const currentToken = this.token.value;
  if (currentToken) return currentToken;

  if (this.isBrowser) {
    const persistedToken = localStorage.getItem('token');
    if (persistedToken) {
        // Si lo encontramos en localStorage, lo propagamos al BehaviorSubject para actualizar el estado
        this.token.next(persistedToken); // <--- RIESGO: Esto es asíncrono.
    }
    return persistedToken;
  }
  return null;
}
 /**   * Devuelve un observable que emite el estado de autenticación basado en la 
existencia del token. 
  * @returns Observable<boolean> 
  */ 
 isLoggedIn(): Observable<boolean> { 
   // Verifica si el token existe y emite un valor booleano. 
   return this.token.asObservable().pipe(map((token: string | null) => !!token)); 
 } 
 
 /**   * Método para cerrar la sesión del usuario. 
  * Elimina el token y redirige al usuario a la página de inicio de sesión. 
  */ 
 logout(): void { 
   this.token.next(null); // Limpia el token almacenado. 
    if (this.isBrowser) {
      localStorage.removeItem('token'); // 🧹 limpia almacenamiento
    }
   this.router.navigate(['/login']); // 👈 mejor que ir a raíz
 } 

 /**
 * Decodifica el JWT para obtener la información del usuario (ej. rol).
 */
private decodeToken(token: string): any | null {
  if (!this.isBrowser) return null; // Evitar la decodificación en el servidor
  try {
    // La decodificación se hace en base64 (atob)
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    console.error('Error decodificando token:', e);
    return null;
  }
}



/**
 * Obtiene el rol actual del usuario logueado.
 * @returns string | null
 */
getUserRole(): string | null {
  const token = this.getToken();
  if (!token) return null;

  const decoded = this.decodeToken(token);
  // Ajusta el nombre del claim según tu backend (por ejemplo: "role", "roles", "authorities")
  const role = decoded?.role || decoded?.roles?.[0] || decoded?.authorities?.[0]?.authority || null;
   // Si el rol viene como "ROLE_MANAGER", quitamos el prefijo
   return role ? role.replace('ROLE_', '') : null;
}

/**
 * Verifica si el usuario logueado es manager (o admin).
 */
isManager(): boolean {
   const role = this.getUserRole();
   return role === 'MANAGER' || role === 'ADMIN'; // Verifica si es Manager o Admin
}

}