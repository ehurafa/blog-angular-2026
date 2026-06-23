import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import type { User } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseService);

  // signal que guarda o usuário logado (ou null se deslogado)
  currentUser = signal<User | null>(null);

  constructor() {
    // Ao carregar o app, verifica se já existe uma sessão salva
    this.supabase.client.auth.getSession().then(({ data }) => {
      this.currentUser.set(data.session?.user ?? null);
    });

    // Escuta mudanças de login/logout em tempo real
    this.supabase.client.auth.onAuthStateChange((_event, session) => {
      this.currentUser.set(session?.user ?? null);
    });
  }

  async signUp(email: string, password: string) {
    const { error } = await this.supabase.client.auth.signUp({ email, password });
    if (error) throw error;
  }

  async signIn(email: string, password: string) {
    const { error } = await this.supabase.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async signOut() {
    await this.supabase.client.auth.signOut();
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}