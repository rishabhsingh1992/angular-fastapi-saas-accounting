import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-billing-page',
  template: `
    <section class="page">
      <h1>Billing</h1>
      <p>Invoices, payment methods, and subscription details.</p>
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
export class BillingPage {}
