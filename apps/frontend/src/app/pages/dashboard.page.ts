import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  protected readonly summary = signal({
    totalRevenue: 120000,
    totalInvoices: 45,
    totalCustomers: 12,
  });
}
