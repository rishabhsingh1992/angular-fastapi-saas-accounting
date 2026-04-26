import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-expenses-page',
  template: `
    <section class="page">
      <h1>Expenses</h1>
      <p>Monitor spend categories and reimbursement workflows.</p>
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
export class ExpensesPage {}
