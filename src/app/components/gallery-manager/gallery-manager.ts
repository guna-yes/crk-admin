import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, resolveImageUrl } from '../../services/api.service';
import { GalleryItem, GallerySection } from '../../models/gallery.model';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-gallery-manager',
  standalone: true,
  imports: [FormsModule, Icon],
  templateUrl: './gallery-manager.html',
  styleUrl: './gallery-manager.css',
})
export class GalleryManager implements OnInit {
  private readonly api = inject(ApiService);

  readonly section = signal<GallerySection>('work');
  readonly all = signal<GalleryItem[]>([]);
  readonly items = computed(() => this.all().filter((i) => i.section === this.section()));
  readonly busy = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.api.getGallery().subscribe({
      next: (items) => this.all.set(items),
      error: () => this.error.set('Could not load the gallery.'),
    });
  }

  photo(item: GalleryItem): string | null {
    return resolveImageUrl(item.imageUrl);
  }

  onFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    this.upload(files);
  }

  private upload(files: File[]): void {
    const file = files.shift();
    if (!file) {
      this.busy.set(false);
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.api.addGalleryItem(file, this.section()).subscribe({
      next: (item) => {
        this.all.update((list) => [...list, item]);
        this.upload(files);
      },
      error: () => {
        this.error.set('Upload failed. Use a JPG, PNG or WEBP under 5 MB.');
        this.busy.set(false);
      },
    });
  }

  save(item: GalleryItem, title: string, caption: string): void {
    this.api.updateGalleryItem(item.id, { title, caption }).subscribe({
      next: (updated) =>
        this.all.update((list) => list.map((i) => (i.id === updated.id ? updated : i))),
      error: () => this.error.set('Could not save changes.'),
    });
  }

  move(index: number, delta: number): void {
    const list = [...this.items()];
    const target = index + delta;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    const others = this.all().filter((i) => i.section !== this.section());
    this.all.set([...others, ...list.map((item, order) => ({ ...item, order }))]);
    this.api.reorderGallery(list.map((i) => i.id)).subscribe({
      error: () => this.error.set('Could not save the new order.'),
    });
  }

  remove(item: GalleryItem): void {
    if (!confirm('Delete this photo?')) return;
    this.api.deleteGalleryItem(item.id).subscribe({
      next: () => this.all.update((list) => list.filter((i) => i.id !== item.id)),
      error: () => this.error.set('Could not delete the photo.'),
    });
  }
}
