import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe, SlicePipe } from '@angular/common';
import { PostsService, Post } from '../../../core/posts.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatProgressSpinnerModule,DatePipe, SlicePipe],
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss',
})
export class PostListComponent implements OnInit {
  private postsService = inject(PostsService);
  authService = inject(AuthService);

  posts = signal<Post[]>([]);
  loading = signal(true);

  async ngOnInit() {
    this.posts.set(await this.postsService.getAll());
    this.loading.set(false);
  }
}