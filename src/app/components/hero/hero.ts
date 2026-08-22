import { Component, inject, output } from '@angular/core';
import { CatalogStore } from '../../services/catalog-store.service';
import { FurnitureViewer } from '../furniture-viewer/furniture-viewer';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [FurnitureViewer, Icon],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  private readonly store = inject(CatalogStore);

  readonly selectedProduct = this.store.selectedProduct;

  readonly viewCatalog = output<void>();
  readonly addFurniture = output<void>();

  formatPrice(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  }
}
