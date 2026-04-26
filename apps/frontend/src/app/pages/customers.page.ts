import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-customers-page',
  template: `
    <section class="page">
      <h1>Customers</h1>
      <p>Customer account summaries and lifecycle stages.</p>
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
export class CustomersPage {}
