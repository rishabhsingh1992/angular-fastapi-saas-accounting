import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-overview-page',
  template: `
    <section class="page">
      <h1>Overview</h1>
      <p>Tenant overview and top-level KPIs appear here.</p>
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
export class OverviewPage {}
