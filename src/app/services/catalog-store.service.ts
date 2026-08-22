import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { NewProduct, Product, ProductPatch } from '../models/product.model';
import { Lead, NewLead } from '../models/lead.model';

const SEED_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Royal Teak Sofa',
    category: 'Sofa',
    wood: 'Teak',
    finish: 'Walnut polish',
    price: 42000,
    stock: 3,
    deliveryDays: 7,
    dimensions: '6 x 3 ft',
    description: 'A sturdy three-seat sofa with deep cushions, built for daily family use.',
    color: '#8b5a2b',
    featured: true,
    imageUrl: null,
  },
  {
    id: 'p2',
    name: 'Classic Sheesham Dining Set',
    category: 'Dining',
    wood: 'Sheesham',
    finish: 'Matte natural',
    price: 38500,
    stock: 2,
    deliveryDays: 10,
    dimensions: '6 seater',
    description: 'A six-seater dining table with matching chairs, finished to show the natural grain.',
    color: '#8a5c34',
    featured: false,
    imageUrl: null,
  },
  {
    id: 'p3',
    name: 'Serene King Bed',
    category: 'Bed',
    wood: 'Mango wood',
    finish: 'White wash',
    price: 29900,
    stock: 4,
    deliveryDays: 5,
    dimensions: '6.5 x 6 ft',
    description: 'A king-size bed frame with a wide headboard and a soft white-washed finish.',
    color: '#c9a37b',
    featured: false,
    imageUrl: null,
  },
  {
    id: 'p4',
    name: 'Comfort Wooden Armchair',
    category: 'Chair',
    wood: 'Teak',
    finish: 'Honey polish',
    price: 8500,
    stock: 6,
    deliveryDays: 4,
    dimensions: '2.5 x 2.5 ft',
    description: 'A single armchair with a firm cushioned seat, ideal for reading corners.',
    color: '#9c6b3e',
    featured: false,
    imageUrl: null,
  },
  {
    id: 'p5',
    name: 'Grand 3-Door Wardrobe',
    category: 'Wardrobe',
    wood: 'Sheesham',
    finish: 'Walnut polish',
    price: 34500,
    stock: 2,
    deliveryDays: 12,
    dimensions: '6 x 6 ft',
    description: 'A spacious three-door wardrobe with a full-length mirror panel.',
    color: '#6b4420',
    featured: false,
    imageUrl: null,
  },
];

@Injectable({ providedIn: 'root' })
export class CatalogStore {
  private readonly api = inject(ApiService);

  private readonly _products = signal<Product[]>(SEED_PRODUCTS);
  private readonly _leads = signal<Lead[]>([]);
  private readonly _selectedId = signal<string | null>(SEED_PRODUCTS[0].id);
  private readonly _backendOnline = signal(false);

  readonly searchTerm = signal('');
  readonly categoryFilter = signal<string>('All');

  readonly products = this._products.asReadonly();
  readonly leads = this._leads.asReadonly();
  readonly backendOnline = this._backendOnline.asReadonly();

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const category = this.categoryFilter();
    return this._products().filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const matchesTerm =
        !term ||
        [product.name, product.category, product.wood].some((field) =>
          field.toLowerCase().includes(term),
        );
      return matchesCategory && matchesTerm;
    });
  });

  readonly selectedProduct = computed(
    () => this._products().find((product) => product.id === this._selectedId()) ?? null,
  );

  readonly stats = computed(() => {
    const products = this._products();
    return {
      totalItems: products.length,
      totalStock: products.reduce((sum, product) => sum + (product.stock || 0), 0),
      totalLeads: this._leads().length,
    };
  });

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.api.getProducts().subscribe({
      next: (products) => {
        this._backendOnline.set(true);
        if (products?.length) {
          this._products.set(products);
          this._selectedId.set(products[0].id);
        }
      },
      error: () => console.warn('CRK Furnitures API not reachable yet - using local seed data.'),
    });

    this.api.getLeads().subscribe({
      next: (leads) => this._leads.set(leads ?? []),
      error: () => console.warn('Leads are not available yet - sign in to load customer enquiries.'),
    });
  }

  selectProduct(id: string): void {
    this._selectedId.set(id);
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  setCategoryFilter(category: string): void {
    this.categoryFilter.set(category);
  }

  addProduct(input: NewProduct, imageFile?: File | null): Product {
    const product: Product = { ...input, id: this.generateId('p'), imageUrl: null };
    this._products.update((list) => [product, ...list]);
    this._selectedId.set(product.id);

    this.api.createProduct(input).subscribe({
      next: (saved) => {
        this._products.update((list) =>
          list.map((item) => (item.id === product.id ? saved : item)),
        );
        this._selectedId.set(saved.id);
        if (imageFile) {
          this.uploadImage(saved.id, imageFile);
        }
      },
      error: () => console.warn('Could not sync the new product to the backend yet.'),
    });

    return product;
  }

  updateProduct(id: string, patch: ProductPatch, imageFile?: File | null): void {
    this._products.update((list) =>
      list.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );

    this.api.updateProduct(id, patch).subscribe({
      next: (saved) => {
        this._products.update((list) => list.map((item) => (item.id === id ? saved : item)));
        if (imageFile) {
          this.uploadImage(id, imageFile);
        }
      },
      error: () => console.warn('Could not sync the product update to the backend yet.'),
    });
  }

  deleteProduct(id: string): void {
    this._products.update((list) => list.filter((item) => item.id !== id));
    if (this._selectedId() === id) {
      this._selectedId.set(this._products()[0]?.id ?? null);
    }

    this.api.deleteProduct(id).subscribe({
      error: () => console.warn('Could not delete the product on the backend yet.'),
    });
  }

  private uploadImage(id: string, file: File): void {
    this.api.uploadProductImage(id, file).subscribe({
      next: (saved) => {
        this._products.update((list) => list.map((item) => (item.id === id ? saved : item)));
      },
      error: () => console.warn('Could not upload the product image yet.'),
    });
  }

  addLead(input: NewLead): Lead {
    const lead: Lead = { ...input, id: this.generateId('l'), createdAt: new Date().toISOString() };
    this._leads.update((list) => [lead, ...list]);

    this.api.createLead(input).subscribe({
      next: (saved) => {
        if (saved?.id) {
          this._leads.update((list) => list.map((item) => (item.id === lead.id ? saved : item)));
        }
      },
      error: () => console.warn('Could not sync the new lead to the backend yet.'),
    });

    return lead;
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
}
