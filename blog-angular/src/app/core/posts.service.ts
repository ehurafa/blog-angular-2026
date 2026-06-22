import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Post {
  id?: number;
  title: string;
  content: string;
  author_id?: string;
  author_email?: string;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  private supabase = inject(SupabaseService);

  // Lista todos os posts, mais recentes primeiro
  async getAll(): Promise<Post[]> {
    const { data, error } = await this.supabase.client
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Post[];
  }

  // Busca um post específico pelo id
  async getById(id: number): Promise<Post> {
    const { data, error } = await this.supabase.client
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Post;
  }

  // Cria um post novo (author_id é preenchido pelo default no banco, via auth.uid())
  async create(post: Pick<Post, 'title' | 'content'>): Promise<void> {
    const { data: userData } = await this.supabase.client.auth.getUser();

    const { error } = await this.supabase.client.from('posts').insert({
      title: post.title,
      content: post.content,
      author_email: userData.user?.email,
    });

    if (error) throw error;
  }

  // Atualiza um post (RLS garante que só o autor pode editar)
  async update(id: number, post: Pick<Post, 'title' | 'content'>): Promise<void> {
    const { error } = await this.supabase.client
      .from('posts')
      .update({ title: post.title, content: post.content })
      .eq('id', id);

    if (error) throw error;
  }

  // Exclui um post (RLS garante que só o autor pode excluir)
  async delete(id: number): Promise<void> {
    const { error } = await this.supabase.client.from('posts').delete().eq('id', id);
    if (error) throw error;
  }
}