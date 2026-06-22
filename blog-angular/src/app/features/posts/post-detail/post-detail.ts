import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PostsService, Post } from '../../../core/posts.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
})
export class PostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postsService = inject(PostsService);
  authService = inject(AuthService);

  post = signal<Post | null>(null);

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.post.set(await this.postsService.getById(id));
  }

  isAuthor(): boolean {
    const user = this.authService.currentUser();
    return !!user && user.id === this.post()?.author_id;
  }

  async deletePost() {
    if (!confirm('Tem certeza que quer excluir este post?')) return;
    await this.postsService.delete(this.post()!.id!);
    this.router.navigate(['/posts']);
  }
}