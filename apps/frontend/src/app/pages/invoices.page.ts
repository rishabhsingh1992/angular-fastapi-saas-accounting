import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-invoices-page',
  template: `
    <section class="page">
      <h1>Invoices</h1>
      <p>Track billing documents, statuses, and due dates.</p>
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
export class InvoicesPage {}
