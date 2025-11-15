import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ListsService } from '../../core/services/lists.service';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-lists',
  standalone: true,
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class ListsComponent implements OnInit {

  lists: any[] = [];
  newListName = '';
  userId!: number;

  // Panel para añadir videojuegos
  showAddGamesPanel = false;
  selectedListId!: number;
  videoGames: any[] = [];

  constructor(
    private listsService: ListsService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.authService.getUserId();
    if (!id) return;

    this.userId = id;
    this.loadLists();
  }

  loadLists(): void {
  this.listsService.getUserLists().subscribe({
    next: (response: any) => this.lists = response.content ?? response,
    error: err => console.error('Error cargando listas:', err)
  });
}

createList(): void {
  if (!this.newListName.trim()) return;

  this.listsService.createList(this.newListName).subscribe({
    next: () => {
      this.newListName = '';
      this.loadLists();
    },
    error: err => console.error('Error creando lista:', err)
  });
}


  deleteList(id: number): void {
    if (!confirm("¿Seguro que deseas eliminar esta lista?")) return;

    this.listsService.deleteList(id).subscribe({
      next: () => this.loadLists(),
      error: err => console.error('Error eliminando lista:', err)
    });
  }

  // 👉 NUEVO: Navegar a la página de edición
  goToEditPage(listId: number): void {
    this.router.navigate(['/lists/edit', listId]);
  }

  // Añadir juegos
  openAddGames(listId: number): void {
    this.selectedListId = listId;
    this.showAddGamesPanel = true;
    this.loadAllGames();
  }

  closeAddGames(): void {
    this.showAddGamesPanel = false;
  }

  loadAllGames(): void {
    this.http.get('http://localhost:8080/api/videogames').subscribe({
      next: (data: any) => this.videoGames = data.content ?? data,
      error: err => console.error('Error cargando videojuegos:', err)
    });
  }

  addGame(gameId: number): void {
    this.listsService.addGameToList(this.selectedListId, gameId).subscribe({
      next: () => alert('🎉 Videojuego añadido a la lista'),
      error: err => console.error('Error añadiendo videojuego:', err)
    });
  }
}
