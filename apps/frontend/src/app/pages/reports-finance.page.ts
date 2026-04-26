import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-reports-finance-page',
  template: `
    <div class="report-card">
      <h2>Finance Report</h2>
      <p>Cashflow, liabilities, and P&L trend insights.</p>
    </div>
  `,
  styles: [
    `
      .report-card {
        background: #ffffff;
        border: 1px solid #dbe3ef;
        border-radius: 12px;
        padding: 16px;
        margin-top: 12px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsFinancePage {}
