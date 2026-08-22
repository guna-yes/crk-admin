import { Component, inject } from '@angular/core';
import { CatalogStore } from '../../services/catalog-store.service';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [Icon],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats {
  private readonly store = inject(CatalogStore);

  readonly stats = this.store.stats;
}
