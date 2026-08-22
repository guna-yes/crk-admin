import { Component, OnDestroy, OnInit, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogStore } from '../../services/catalog-store.service';
import { PRODUCT_CATEGORIES, Product } from '../../models/product.model';
import { resolveImageUrl } from '../../services/api.service';
import { Icon } from '../icon/icon';

type PhotoMode = 'system' | 'upload';

@Component({
  selector: 'app-furniture-form',
  standalone: true,
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './furniture-form.html',
  styleUrl: './furniture-form.css',
})
export class FurnitureForm implements OnInit, OnDestroy {
  private readonly store = inject(CatalogStore);
  private readonly fb = inject(FormBuilder);

  readonly editProduct = input<Product | null>(null);

  readonly categories = PRODUCT_CATEGORIES;
  readonly closed = output<void>();
  readonly submitted = signal(false);

  readonly photoMode = signal<PhotoMode>('system');
  readonly selectedFile = signal<File | null>(null);
  readonly previewUrl = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    wood: [''],
    finish: [''],
    price: [null as number | null, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.min(0)]],
    deliveryDays: [0, [Validators.min(0)]],
    dimensions: [''],
    color: ['#8b5a2b'],
    description: [''],
  });

  private objectUrl: string | null = null;

  get f() {
    return this.form.controls;
  }

  get isEditing(): boolean {
    return !!this.editProduct();
  }

  ngOnInit(): void {
    const product = this.editProduct();
    if (!product) return;

    this.form.patchValue({
      name: product.name,
      category: product.category,
      wood: product.wood,
      finish: product.finish,
      price: product.price,
      stock: product.stock,
      deliveryDays: product.deliveryDays,
      dimensions: product.dimensions,
      color: product.color,
      description: product.description,
    });

    if (product.imageUrl) {
      this.photoMode.set('upload');
      this.previewUrl.set(resolveImageUrl(product.imageUrl));
    }
  }

  ngOnDestroy(): void {
    this.revokeObjectUrl();
  }

  setPhotoMode(mode: PhotoMode): void {
    this.photoMode.set(mode);
    if (mode === 'system') {
      this.selectedFile.set(null);
      this.revokeObjectUrl();
      this.previewUrl.set(null);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.revokeObjectUrl();
    this.objectUrl = URL.createObjectURL(file);
    this.selectedFile.set(file);
    this.previewUrl.set(this.objectUrl);
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const patch = {
      name: value.name.trim(),
      category: value.category,
      wood: value.wood.trim(),
      finish: value.finish.trim(),
      price: Number(value.price),
      stock: Number(value.stock) || 0,
      deliveryDays: Number(value.deliveryDays) || 0,
      dimensions: value.dimensions.trim(),
      description: value.description.trim(),
      color: value.color,
      featured: this.editProduct()?.featured ?? false,
    };
    const imageFile = this.photoMode() === 'upload' ? this.selectedFile() : null;

    const existing = this.editProduct();
    if (existing) {
      this.store.updateProduct(existing.id, patch, imageFile);
    } else {
      this.store.addProduct(patch, imageFile);
    }

    this.submitted.set(true);
    setTimeout(() => this.closed.emit(), 900);
  }

  onClose(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
