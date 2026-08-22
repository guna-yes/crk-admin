import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

const TOKEN_KEY = 'crk_admin_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly isAuthenticated = () => this._token() !== null;

  getToken(): string | null {
    return this._token();
  }

  login(username: string, password: string): Observable<{ accessToken: string; username: string }> {
    return this.api.login(username, password).pipe(
      tap((result) => {
        localStorage.setItem(TOKEN_KEY, result.accessToken);
        this._token.set(result.accessToken);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
  }

  handleUnauthorized(): void {
    this.logout();
  }
}
