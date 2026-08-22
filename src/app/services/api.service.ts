import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewProduct, Product, ProductPatch } from '../models/product.model';
import { Lead, NewLead } from '../models/lead.model';

export const API_ORIGIN = 'https://crk-furnitures-api.onrender.com';
const BASE_URL = `${API_ORIGIN}/api`;

export function resolveImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) return null;
  return imageUrl.startsWith('/') ? `${API_ORIGIN}${imageUrl}` : imageUrl;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  health(): Observable<{ ok: boolean; service: string }> {
    return this.http.get<{ ok: boolean; service: string }>(`${BASE_URL}/health`);
  }

  login(username: string, password: string): Observable<{ accessToken: string; username: string }> {
    return this.http.post<{ accessToken: string; username: string }>(`${BASE_URL}/auth/login`, {
      username,
      password,
    });
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${BASE_URL}/products`);
  }

  createProduct(product: NewProduct): Observable<Product> {
    return this.http.post<Product>(`${BASE_URL}/products`, product);
  }

  updateProduct(id: string, patch: ProductPatch): Observable<Product> {
    return this.http.patch<Product>(`${BASE_URL}/products/${id}`, patch);
  }

  deleteProduct(id: string): Observable<{ success: true }> {
    return this.http.delete<{ success: true }>(`${BASE_URL}/products/${id}`);
  }

  uploadProductImage(id: string, file: File): Observable<Product> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<Product>(`${BASE_URL}/products/${id}/image`, formData);
  }

  getLeads(): Observable<Lead[]> {
    return this.http.get<Lead[]>(`${BASE_URL}/leads`);
  }

  createLead(lead: NewLead): Observable<Lead> {
    return this.http.post<Lead>(`${BASE_URL}/leads`, lead);
  }
}
