import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogStore } from '../../services/catalog-store.service';
import { PRODUCT_CATEGORIES } from '../../models/product.model';
import { ProductCard } from '../product-card/product-card';
import { ProductDetails } from '../product-details/product-details';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [FormsModule, ProductCard, ProductDetails, Icon],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  private readonly store = inject(CatalogStore);

  readonly categories = ['All', ...PRODUCT_CATEGORIES];
  readonly filteredProducts = this.store.filteredProducts;
  readonly selectedProduct = this.store.selectedProduct;
  readonly searchTerm = this.store.searchTerm;
  readonly categoryFilter = this.store.categoryFilter;

  readonly enquire = output<string>();
  readonly editProduct = output<string>();
  readonly deleteProduct = output<string>();

  onSearch(term: string): void {
    this.store.setSearchTerm(term);
  }

  onCategoryChange(category: string): void {
    this.store.setCategoryFilter(category);
  }

  onSelect(id: string): void {
    this.store.selectProduct(id);
  }

  onEnquire(productId: string): void {
    this.enquire.emit(productId);
  }
}
