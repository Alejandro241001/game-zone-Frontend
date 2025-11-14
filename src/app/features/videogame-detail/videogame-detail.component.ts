import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { VideogameDetailService, VideoGame } from '../../core/services/videogame-detail.service';
import { AuthService } from '../../core/services/auth.service';
import { ReviewService } from '../../core/services/review.service';

@Component({
  selector: 'app-videogame-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  templateUrl: './videogame-detail.component.html'
})
export class VideogameDetailComponent implements OnInit {

  videogame: VideoGame | null = null;
  reviews: any[] = [];

  error: string | null = null;
  loading = true;

  isManager = false;
  editing = false;

  /* =============================================================
      REVIEW NUEVA
  ============================================================= */
  newReview = {
    reviewText: '',
    rating: 5
  };

  /* =============================================================
      REVIEW EN EDICIÓN INLINE
  ============================================================= */
  editingReviewId: number | null = null;

  editReview = {
    reviewText: '',
    rating: 0
  };

  constructor(
    private route: ActivatedRoute,
    private videogameDetailService: VideogameDetailService,
    public authService: AuthService,
    private reviewService: ReviewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isManager = this.authService.isManager();
    this.loadVideogameDetail();
  }

  get currentUserId(): number | null {
    return this.authService.getUserId();
  }

  /** Verifica si la review pertenece al usuario logueado */
isCurrentUserOwner(userId: number): boolean {
  return this.currentUserId === userId;
}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedInSync();
  }

  /* =============================================================
      CARGAR VIDEOJUEGO
  ============================================================= */
  loadVideogameDetail(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.videogameDetailService.fetchVideogameById(id).subscribe({
      next: data => {
        this.videogame = data;
        this.loadReviews(id);
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el videojuego.';
        this.loading = false;
      }
    });
  }

  /* =============================================================
      CARGAR REVIEWS
  ============================================================= */
  loadReviews(videoGameId: number): void {
    this.reviewService.getReviewsByVideogame(videoGameId).subscribe({
      next: data => (this.reviews = data)
    });
  }

  /* =============================================================
      CREAR REVIEW
  ============================================================= */
  submitReview(): void {
    this.createReview();
  }

  createReview(): void {
    if (!this.videogame) return;

    const dto = {
      videoGameId: this.videogame.id,
      reviewText: this.newReview.reviewText,
      rating: this.newReview.rating
    };

    this.reviewService.createReview(dto).subscribe({
      next: () => {
        this.newReview.reviewText = '';
        this.newReview.rating = 5;
        this.loadReviews(this.videogame!.id);
      },
      error: () => (this.error = 'No se pudo enviar la review.')
    });
  }

  /* =============================================================
      EDITAR REVIEW (INLINE)
  ============================================================= */

  /** Inicia la edición */
  startEdit(review: any): void {
    this.editingReviewId = review.id;
    this.editReview = {
      reviewText: review.reviewText,
      rating: review.rating
    };
  }

  /** Cancelar edición */
  cancelEdit(): void {
    this.editingReviewId = null;
  }

  /** Guardar cambios */
  saveEditedReview(reviewId: number): void {
    if (!this.videogame) return;

    const dto = {
      videoGameId: this.videogame.id,
      reviewText: this.editReview.reviewText,
      rating: this.editReview.rating
    };

    this.reviewService.updateReview(reviewId, dto).subscribe({
      next: () => {
        this.editingReviewId = null;
        this.loadReviews(this.videogame!.id);
      },
      error: () => (this.error = 'No se pudo actualizar la review.')
    });
  }

  /* =============================================================
      ELIMINAR REVIEW
  ============================================================= */
  deleteReview(id: number): void {
    if (!confirm('¿Seguro que quieres eliminar esta review?')) return;

    this.reviewService.deleteReview(id).subscribe({
      next: () => this.loadReviews(this.videogame!.id),
      error: () => (this.error = 'No se pudo eliminar la review.')
    });
  }

  /* =============================================================
      EDITAR VIDEOJUEGO (MANAGER)
  ============================================================= */

  enableEdit(): void {
    this.editing = true;
  }

  saveChanges(): void {
    if (!this.videogame) return;

    this.videogameDetailService.updateVideogame(this.videogame.id, this.videogame).subscribe({
      next: updated => {
        this.videogame = updated;
        this.editing = false;
      },
      error: () => (this.error = 'Error al actualizar el videojuego.')
    });
  }

  deleteVideogame(): void {
    if (!this.videogame) return;

    if (!confirm('¿Seguro que deseas eliminar este videojuego?')) return;

    this.videogameDetailService.deleteVideogame(this.videogame.id).subscribe({
      next: () => {
        alert('Eliminado correctamente');
        this.router.navigate(['/videogames']);
      }
    });
  }
}
