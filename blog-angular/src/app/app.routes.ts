import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { PostListComponent } from './features/posts/post-list/post-list';
import { PostDetailComponent } from './features/posts/post-detail/post-detail';
import { PostFormComponent } from './features/posts/post-form/post-form';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'posts', component: PostListComponent },
  { path: 'posts/novo', component: PostFormComponent, canActivate: [authGuard] },
  { path: 'posts/:id', component: PostDetailComponent },
  { path: 'posts/:id/editar', component: PostFormComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'posts' },
];