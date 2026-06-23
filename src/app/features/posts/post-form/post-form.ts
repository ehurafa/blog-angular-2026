import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { PostsService } from '../../../core/posts.service';
import { CategoriesService, Category } from '../../../core/categories.service';
import { PostCoverComponent } from '../../../shared/post-cover/post-cover';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, PostCoverComponent],
  templateUrl: './post-form.html',
  styleUrl: './post-form.scss',
})
export class PostFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postsService = inject(PostsService);
  private categoriesService = inject(CategoriesService);

  postId = signal<number | null>(null);
  categories = signal<Category[]>([]);

  title = signal('');
  content = signal('');
  categoryId = signal<number | null>(null);
  coverUrl = signal('');
  saving = signal(false);
  errorMessage = signal('');

  async ngOnInit() {
    this.categories.set(await this.categoriesService.getAll());

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.postId.set(id);
      const post = await this.postsService.getById(id);
      this.title.set(post.title);
      this.content.set(post.content);
      this.categoryId.set(post.category_id);
      this.coverUrl.set(post.cover_url ?? '');
    }
  }

  isEditMode(): boolean {
    return this.postId() !== null;
  }

  async submit() {
    this.saving.set(true);
    this.errorMessage.set('');
    try {
      const payload = {
        title: this.title(),
        content: this.content(),
        category_id: this.categoryId()!,
        cover_url: this.coverUrl().trim() || null,
      };
      if (this.isEditMode()) {
        await this.postsService.update(this.postId()!, payload);
        this.router.navigate(['/posts', this.postId()]);
      } else {
        await this.postsService.create(payload);
        this.router.navigate(['/posts']);
      }
    } catch (err) {
      this.errorMessage.set((err as Error).message);
    } finally {
      this.saving.set(false);
    }
  }
}