import { Component, input, output } from '@angular/core';
import { Product } from '../../models/product.model';
import { resolveImageUrl } from '../../services/api.service';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [Icon],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  product = input<Product | null>(null);

  enquire = output<string>();
  edit = output<string>();
  remove = output<string>();

  formatPrice(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  imageUrl(product: Product): string | null {
    return resolveImageUrl(product.imageUrl);
  }
}
