import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-page',
  template: `
    <section class="page">
      <h1>Dashboard</h1>
      <p>High-level KPIs, recent activity, and quick actions.</p>
    </section>
  `,
  styles: [
    `
      .page {
        padding: 24px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {}
