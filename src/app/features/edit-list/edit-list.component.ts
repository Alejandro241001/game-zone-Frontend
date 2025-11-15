import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListsService } from '../../core/services/lists.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-edit-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit {

  listId!: number;
  userId!: number;  // ⭐ NECESARIO
  listName = '';
  videoGames: any[] = [];
  selectedGameId: number | null = null;

  listGames: any[] = []; // Juegos ya dentro de la lista

  constructor(
    private route: ActivatedRoute,
    private listsService: ListsService,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.listId = Number(this.route.snapshot.paramMap.get('id'));
    this.userId = this.authService.getUserId()!; // ⭐ CARGAMOS USER ID

    this.loadList();
    this.loadAllGames();
  }

  loadList(): void {
  this.listsService.getListById(this.listId).subscribe({
    next: (list: any) => {
      this.listName = list.name;

      this.listGames = (list.videoGames || []).map((g: any) => ({
        id: g.id,
        name: g.name,
        img: g.img
      }));
    },
    error: err => console.error('Error cargando lista:', err)
  });
}

  loadAllGames(): void {
  this.http.get('http://localhost:8080/api/videogames?page=0&size=500').subscribe({
    next: (data: any) => {
      if (Array.isArray(data)) {
        this.videoGames = data;                     // Si viene como array directo
      } else if (data.content) {
        this.videoGames = data.content;             // Si viene paginado
      } else {
        console.error("⚠ Formato inesperado de videojuegos:", data);
      }
    },
    error: (err) => console.error('Error cargando videojuegos:', err)
  });
}

  saveName(): void {
    this.listsService.updateList(this.listId, this.listName).subscribe({
      next: () => alert("Nombre actualizado"),
      error: err => console.error('Error actualizando nombre:', err)
    });
  }

  addGame(): void {
    if (!this.selectedGameId) return;

    this.listsService.addGameToList(this.listId, this.selectedGameId).subscribe({
      next: () => {
        alert("Juego añadido");
        this.loadList(); // refrescar los juegos de la lista
      },
      error: err => console.error('Error añadiendo juego:', err)
    });
  }

  goBack(): void {
  this.router.navigate(['/lists']);
}

  removeGame(gameId: number) {
  if (!confirm("¿Quieres quitar este videojuego de la lista?")) return;

  this.listsService.removeGameFromList(this.listId, gameId).subscribe({
    next: () => {
      this.loadList();
    },
    error: err => console.error("Error eliminando juego:", err)
  });
}


}
