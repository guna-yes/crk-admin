import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogStore } from '../../services/catalog-store.service';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './lead-form.html',
  styleUrl: './lead-form.css',
})
export class LeadForm implements OnInit {
  private readonly store = inject(CatalogStore);
  private readonly fb = inject(FormBuilder);

  readonly preselectedProductId = input<string | null>(null);
  readonly products = this.store.products;
  readonly closed = output<void>();
  readonly submitted = signal(false);

  readonly form = this.fb.nonNullable.group({
    customerName: ['', Validators.required],
    phone: ['', Validators.required],
    productId: ['', Validators.required],
    notes: [''],
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    const preselected = this.preselectedProductId();
    if (preselected) {
      this.form.patchValue({ productId: preselected });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.store.addLead({
      customerName: value.customerName.trim(),
      phone: value.phone.trim(),
      productId: value.productId,
      notes: value.notes.trim(),
    });

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
