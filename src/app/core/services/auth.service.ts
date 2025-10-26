import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Router } from '@angular/router'; 
import { BehaviorSubject, catchError, throwError, Observable } from 'rxjs'; 
import { map } from 'rxjs/operators'; 
import { environment } from '../../../environments/environment';
 
@Injectable({ 
 providedIn: 'root', 
}) 
export class AuthService { 
 private token = new BehaviorSubject<string | null>(null); 
 // BehaviorSubject almacena el token y permite a otros componentes reaccionar cuando 

 
 constructor(private http: HttpClient, private router: Router) {} 
 
 /** 
  * Método para autenticar al usuario. 
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
 
 /** 
  * Almacena el token de autenticación en el BehaviorSubject. 
  * @param token - Token recibido tras una autenticación exitosa. 
  */ 
 setToken(token: string): void { 
   this.token.next(token); // Actualiza el valor del token. 
   localStorage.setItem('token', token); // 💾 guarda el token
 } 
 
 /** 
  * Obtiene el token actual almacenado en el BehaviorSubject. 
  * @returns El token actual o null si no está definido. 
  */ 
 getToken(): string | null { 
  const currentToken = this.token.value || localStorage.getItem('token');
   return this.token.value; 
   
 } 
 
 /** 
  * Devuelve un observable que emite el estado de autenticación basado en la 
existencia del token. 
  * @returns Observable<boolean> 
  */ 
 isLoggedIn(): Observable<boolean> { 
   // Verifica si el token existe y emite un valor booleano. 
   return this.token.asObservable().pipe(map((token: string | null) => !!token)); 
 } 
 
 /** 
  * Método para cerrar la sesión del usuario. 
  * Elimina el token y redirige al usuario a la página de inicio de sesión. 
  */ 
 logout(): void { 
   this.token.next(null); // Limpia el token almacenado. 
   this.router.navigate(['/']); // Redirige al usuario a la ruta raíz. 
   localStorage.removeItem('token'); // 🧹 limpia almacenamiento
 } 

 /**
 * Decodifica el JWT para obtener la información del usuario (ej. rol).
 */
private decodeToken(token: string): any | null {
  try {
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
  // 👇 Ajusta el nombre del claim según tu backend (por ejemplo: "role", "roles", "authorities")
  return decoded?.role || decoded?.roles?.[0] || null;
}

/**
 * Verifica si el usuario logueado es manager.
 */
isManager(): boolean {
  return this.getUserRole() === 'MANAGER' || this.getUserRole() === 'ROLE_MANAGER';
}
} 