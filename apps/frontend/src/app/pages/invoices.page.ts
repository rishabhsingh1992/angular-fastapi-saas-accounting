import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MockInvoiceService } from '../shared/services/mock-invoice.service';

@Component({
  selector: 'app-invoices-page',
  imports: [RouterLink],
  template: `
    <section class="page">
      <h1>Invoices</h1>
      <table>
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Client</th>
            <th>Due Date</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (invoice of invoices(); track invoice.id) {
            <tr>
              <td>{{ invoice.invoiceNumber }}</td>
              <td>{{ invoice.clientName }}</td>
              <td>{{ invoice.dueDate }}</td>
              <td>{{ invoice.status }}</td>
              <td>
                <a [routerLink]="['/invoices', invoice.id]">View</a>
              </td>
            </tr>
          }
        </tbody>
      </table>
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

      table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #e2e8f0;
        background: #fff;
      }

      th,
      td {
        text-align: left;
        padding: 10px 12px;
        border-bottom: 1px solid #e2e8f0;
      }

      th {
        font-weight: 600;
        color: #475569;
      }

      tbody tr:last-child td {
        border-bottom: 0;
      }

      a {
        color: #2563eb;
        text-decoration: none;
        font-weight: 600;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesPage {
  private readonly invoiceService = inject(MockInvoiceService);
  protected readonly invoices = this.invoiceService.invoices;
}
