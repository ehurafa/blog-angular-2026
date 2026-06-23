import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-post-cover',
  standalone: true,
  template: `
    @if (coverUrl()) {
      <img [src]="coverUrl()!" [alt]="title()" class="cover" [class.detail]="size() === 'detail'" />
    } @else {
      <div class="cover abstract" [class.detail]="size() === 'detail'" [style.background]="gradient()">
        <div class="blob" [style.background]="blobColors()[0]" style="top: 10%; left: 5%;"></div>
        <div class="blob" [style.background]="blobColors()[1]" style="top: 35%; left: 55%;"></div>
      </div>
    }
  `,
  styles: [`
    .cover { width: 100%; height: 140px; object-fit: cover; display: block; border-radius: 4px 4px 0 0; }
    .cover.detail { height: 260px; }
    .abstract { position: relative; overflow: hidden; }
    .blob { position: absolute; width: 130px; height: 130px; border-radius: 50%; filter: blur(28px); opacity: 0.85; }
  `],
})
export class PostCoverComponent {
  // input() é a API moderna de signal inputs (Angular 17+) — substitui o antigo @Input()
  coverUrl = input<string | null | undefined>(null);
  title = input<string>('');
  seed = input<number | string | undefined>(0);
  size = input<'card' | 'detail'>('card');

  private palette = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6'];

  // computed() deriva valores automaticamente a partir de outros signals — recalcula só quando seed/title mudam
  private hash = computed(() => {
    const str = `${this.seed()}-${this.title()}`;
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  });

  blobColors = computed(() => {
    const h = this.hash();
    return [this.palette[h % this.palette.length], this.palette[(h >> 3) % this.palette.length]];
  });

  gradient = computed(() => {
    const [a, b] = this.blobColors();
    return `linear-gradient(135deg, ${a}22, ${b}22)`;
  });
}