import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, SlicePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { PostsService, Post } from '../../../core/posts.service';
import { CategoriesService, Category } from '../../../core/categories.service';
import { AuthService } from '../../../core/auth.service';
import { PostCoverComponent } from '../../../shared/post-cover/post-cover';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatChipsModule, DatePipe, SlicePipe, PostCoverComponent],
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss',
})
export class PostListComponent implements OnInit {
  private postsService = inject(PostsService);
  private categoriesService = inject(CategoriesService);
  authService = inject(AuthService);

  posts = signal<Post[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);

  // null = "Todas" selecionado
  selectedCategoryId = signal<number | null>(null);

  // computed() recalcula sozinho sempre que `posts` ou `selectedCategoryId` mudam
  filteredPosts = computed(() => {
    const categoryId = this.selectedCategoryId();
    if (categoryId === null) return this.posts();
    return this.posts().filter((p) => p.category_id === categoryId);
  });

  async ngOnInit() {
    const [posts, categories] = await Promise.all([
      this.postsService.getAll(),
      this.categoriesService.getAll(),
    ]);
    this.posts.set(posts);
    this.categories.set(categories);
    this.loading.set(false);
  }

  selectCategory(id: number | null) {
    this.selectedCategoryId.set(id);
  }
}