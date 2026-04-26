import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  BackendHealthResponse,
  BackendHealthService,
} from '../shared/services/backend-health.service';

@Component({
  selector: 'app-dashboard-page',
  template: `
    <section class="page">
      <h1>Dashboard</h1>
      <section class="cards">
        <article class="card">
          <h2>Total Revenue</h2>
          <p>USD {{ summary().totalRevenue }}</p>
        </article>

        <article class="card">
          <h2>Total Invoices</h2>
          <p>{{ summary().totalInvoices }}</p>
        </article>

        <article class="card">
          <h2>Total Customers</h2>
          <p>{{ summary().totalCustomers }}</p>
        </article>

        <article class="card health-card">
          <div class="health-card-header">
            <h2>Backend Health</h2>
            <button type="button" (click)="refreshHealth()">Refresh</button>
          </div>
          <p class="health-message">{{ healthMessage() }}</p>
          <span class="health-status" [class.up]="healthStatus() === 'up'" [class.down]="healthStatus() === 'down'">
            {{ healthStatus() === 'loading' ? 'Checking' : (healthStatus() === 'up' ? 'Healthy' : 'Unavailable') }}
          </span>
        </article>
      </section>
    </section>
  `,
  styles: [
    `
      .page {
        padding: 24px;
      }

      .page h1 {
        margin: 0 0 16px;
      }

      .cards {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }

      .card {
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 14px;
        background: #fff;
      }

      .card h2 {
        margin: 0;
        font-size: 0.95rem;
        color: #475569;
        font-weight: 600;
      }

      .card p {
        margin: 8px 0 0;
        font-size: 1.3rem;
        font-weight: 700;
        color: #0f172a;
      }

      .health-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .health-card-header {
        align-items: center;
        display: flex;
        justify-content: space-between;
        gap: 8px;
      }

      .health-card-header button {
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        background: #f8fafc;
        color: #0f172a;
        cursor: pointer;
        font-weight: 600;
        padding: 6px 10px;
      }

      .health-card-header button:hover {
        background: #e2e8f0;
      }

      .health-message {
        color: #334155;
        font-size: 0.95rem;
        margin: 0;
      }

      .health-status {
        align-self: flex-start;
        border-radius: 999px;
        background: #f1f5f9;
        color: #334155;
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.03em;
        padding: 5px 10px;
        text-transform: uppercase;
      }

      .health-status.up {
        background: #dcfce7;
        color: #166534;
      }

      .health-status.down {
        background: #fee2e2;
        color: #991b1b;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private readonly backendHealthService = inject(BackendHealthService);

  protected readonly summary = signal({
    totalRevenue: 120000,
    totalInvoices: 45,
    totalCustomers: 12,
  });

  protected readonly healthStatus = signal<'loading' | 'up' | 'down'>('loading');
  protected readonly healthMessage = signal('Checking backend connection...');

  constructor() {
    this.refreshHealth();
  }

  protected refreshHealth(): void {
    this.healthStatus.set('loading');
    this.healthMessage.set('Checking backend connection...');

    this.backendHealthService.checkHealth().subscribe({
      next: (response) => this.onHealthSuccess(response),
      error: () => this.onHealthError(),
    });
  }

  private onHealthSuccess(response: BackendHealthResponse): void {
    this.healthStatus.set('up');
    this.healthMessage.set(
      `${response.service} v${response.version} (${response.environment})`
    );
  }

  private onHealthError(): void {
    this.healthStatus.set('down');
    this.healthMessage.set('Backend is unreachable. Confirm API server is running on port 8000.');
  }
}
