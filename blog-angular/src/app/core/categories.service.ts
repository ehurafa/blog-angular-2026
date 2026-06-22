import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private supabase = inject(SupabaseService);

  async getAll(): Promise<Category[]> {
    const { data, error } = await this.supabase.client
      .from('categories')
      .select('*')
      .order('name');
    if (error) throw error;
    return data as Category[];
  }
}