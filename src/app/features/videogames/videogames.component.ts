import { Component, OnInit } from '@angular/core';
// ✅ DESCOMENTADO: Vuelve a importar el servicio real de la API
import { VideogameService } from '../../core/services/videogames.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Añadido si no está en app.config.ts

// Definir una interfaz para tipar mejor los datos
interface VideoGame {
  id: number;
  name: string;
  studio: { name: string };
  releaseYear: number;
  metacritic: number;
  genres: { name: string }[];
  // Si tu DTO devuelve otras propiedades, añádelas aquí (ej: description)
  description?: string; 
  platforms: any[]; // Usamos 'any[]' temporalmente si no tienes PlatformDTO
  reviews: any[];
  // ✅ CORRECCIÓN: Añadida la propiedad 'img' para resolver el error de TypeScript
  img: string;
}

@Component({
  selector: 'app-videogames',
  standalone: true,
  // 💡 Añadimos HttpClientModule para asegurar la funcionalidad si es necesario
  imports: [CommonModule, RouterLink, HttpClientModule], 
  templateUrl: './videogames.component.html',
  // Ya está bien comentado
  //* styleUrls: ['./videogames.component.scss'] 
  // ❌ CORRECCIÓN: Eliminamos la provisión local. El servicio debe ser 'providedIn: root'.
  // providers: [VideogameService] 
})
export class VideogamesComponent implements OnInit {
  
  // ✅ CORREGIDO: Inicializa con un array vacío para cargar datos reales
  videogames: VideoGame[] = []; 
  error: string | null = null; 
  
  // ✅ DESCOMENTADO: Vuelve a inyectar el servicio en el constructor
  constructor(private videogameService: VideogameService) { } 
  
  ngOnInit(): void {
    // ✅ DESCOMENTADO: Llama al método para cargar los datos de la API
    this.loadVideogames();
  }

  // ✅ DESCOMENTADO: Método que llama al servicio para obtener los datos
  loadVideogames(): void {
    this.error = null;
    this.videogames = [];
      
    // Usamos el servicio para suscribirnos a la respuesta de la API
    this.videogameService.fetchVideogames().subscribe({
      next: (data) => {
        // En tu backend estás devolviendo un Page<VideoGameDTO>, 
        // por lo que 'data' podría ser un objeto con 'content', 'totalPages', etc.
        // Si la API devuelve un objeto Page, usamos data.content.
        // Si devuelve directamente el array, usamos data.

        // Suponiendo que la API devuelve un objeto paginado: { content: [...] }
        if (data && Array.isArray(data.content)) {
          this.videogames = data.content;
        } else if (Array.isArray(data)) {
          this.videogames = data;
        } else {
          // Esto puede pasar si el formato no es el esperado
          console.error("Formato de respuesta de API inesperado:", data);
          this.error = 'La API no devolvió una lista válida.';
        }
        this.error = null;
      },
      error: (err) => {
        console.error("Error al cargar videojuegos (Verificar API/CORS):", err);
        // Si el código de estado es 401/403, el error puede ser por el token JWT
        this.error = `Error al cargar los datos: ${err.statusText || 'Error de conexión'}. ¿Token JWT válido?`;
      }
    });
  }

  // Puedes dejar este método si lo necesitas para probar botones
  deleteVideogame(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este videojuego?')) {
      // Aquí iría la llamada al servicio para el borrado real
      console.log(`Simulando borrado del videojuego con ID: ${id}`);
    }
  }
}