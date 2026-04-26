import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-reports-sales-page',
  template: `
    <div class="report-card">
      <h2>Sales Report</h2>
      <p>Sales pipeline by region, cohort, and period.</p>
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
export class ReportsSalesPage {}
