import { Component, inject } from '@angular/core';
import { GalleryManager } from './components/gallery-manager/gallery-manager';
import { Login } from './components/login/login';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GalleryManager, Login],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly auth = inject(AuthService);

  readonly isAuthenticated = this.auth.isAuthenticated;

  logout(): void {
    this.auth.logout();
  }
}
