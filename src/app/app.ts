import { Component, computed, inject, signal } from '@angular/core';
import { Hero } from './components/hero/hero';
import { Catalog } from './components/catalog/catalog';
import { GalleryManager } from './components/gallery-manager/gallery-manager';
import { Stats } from './components/stats/stats';
import { FurnitureForm } from './components/furniture-form/furniture-form';
import { LeadForm } from './components/lead-form/lead-form';
import { Login } from './components/login/login';
import { Icon } from './components/icon/icon';
import { CatalogStore } from './services/catalog-store.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Hero, Catalog, GalleryManager, Stats, FurnitureForm, LeadForm, Login, Icon],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly store = inject(CatalogStore);
  private readonly auth = inject(AuthService);

  readonly isAuthenticated = this.auth.isAuthenticated;

  readonly showFurnitureForm = signal(false);
  readonly editProductId = signal<string | null>(null);
  readonly editingProduct = computed(
    () => this.store.products().find((product) => product.id === this.editProductId()) ?? null,
  );

  readonly showLeadForm = signal(false);
  readonly leadProductId = signal<string | null>(null);

  logout(): void {
    this.auth.logout();
  }

  openAddFurniture(): void {
    this.editProductId.set(null);
    this.showFurnitureForm.set(true);
  }

  openEditFurniture(id: string): void {
    this.editProductId.set(id);
    this.showFurnitureForm.set(true);
  }

  closeFurnitureForm(): void {
    this.showFurnitureForm.set(false);
    this.editProductId.set(null);
  }

  deleteFurniture(id: string): void {
    const product = this.store.products().find((item) => item.id === id);
    const name = product?.name ?? 'this item';
    if (window.confirm(`Delete "${name}" from the catalog? This cannot be undone.`)) {
      this.store.deleteProduct(id);
    }
  }

  openLeadForm(productId: string | null = null): void {
    this.leadProductId.set(productId);
    this.showLeadForm.set(true);
  }

  closeLeadForm(): void {
    this.showLeadForm.set(false);
    this.leadProductId.set(null);
  }

  scrollToCatalog(): void {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  }
}
