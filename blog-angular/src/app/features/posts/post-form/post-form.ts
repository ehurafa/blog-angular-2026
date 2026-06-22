import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PostsService } from '../../../core/posts.service';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './post-form.html',
  styleUrl: './post-form.scss',
})
export class PostFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postsService = inject(PostsService);

  // Se tiver :id na rota, é edição. Se não, é criação.
  postId = signal<number | null>(null);

  title = '';
  content = '';
  saving = signal(false);
  errorMessage = signal('');

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.postId.set(id);
      const post = await this.postsService.getById(id);
      this.title = post.title;
      this.content = post.content;
    }
  }

  isEditMode(): boolean {
    return this.postId() !== null;
  }

  async submit() {
    this.saving.set(true);
    this.errorMessage.set('');

    try {
      if (this.isEditMode()) {
        await this.postsService.update(this.postId()!, { title: this.title, content: this.content });
        this.router.navigate(['/posts', this.postId()]);
      } else {
        await this.postsService.create({ title: this.title, content: this.content });
        this.router.navigate(['/posts']);
      }
    } catch (err) {
      this.errorMessage.set((err as Error).message);
    } finally {
      this.saving.set(false);
    }
  }
}