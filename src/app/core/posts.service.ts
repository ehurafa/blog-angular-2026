import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Category } from './categories.service';

export interface Post {
  id?: number;
  title: string;
  content: string;
  author_id?: string;
  author_email?: string;
  created_at?: string;
  category_id: number;
  cover_url?: string | null;
  category?: Category; // vem populado quando usamos o join no select
}

export interface PostInput {
  title: string;
  content: string;
  category_id: number;
  cover_url?: string | null;
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  private supabase = inject(SupabaseService);

  // O join "category:categories(...)" busca o post E a categoria relacionada numa única query
  private readonly selectWithCategory = '*, category:categories(id, name, slug)';

  async getAll(): Promise<Post[]> {
    const { data, error } = await this.supabase.client
      .from('posts')
      .select(this.selectWithCategory)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as unknown as Post[];
  }

  async getByCategory(categoryId: number): Promise<Post[]> {
    const { data, error } = await this.supabase.client
      .from('posts')
      .select(this.selectWithCategory)
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as unknown as Post[];
  }

  async getById(id: number): Promise<Post> {
    const { data, error } = await this.supabase.client
      .from('posts')
      .select(this.selectWithCategory)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as unknown as Post;
  }

  async create(post: PostInput): Promise<void> {
    const { data: userData } = await this.supabase.client.auth.getUser();

    const { error } = await this.supabase.client.from('posts').insert({
      title: post.title,
      content: post.content,
      category_id: post.category_id,
      cover_url: post.cover_url || null,
      author_email: userData.user?.email,
    });

    if (error) throw error;
  }

  async update(id: number, post: PostInput): Promise<void> {
    const { error } = await this.supabase.client
      .from('posts')
      .update({
        title: post.title,
        content: post.content,
        category_id: post.category_id,
        cover_url: post.cover_url || null,
      })
      .eq('id', id);

    if (error) throw error;
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase.client.from('posts').delete().eq('id', id);
    if (error) throw error;
  }
}