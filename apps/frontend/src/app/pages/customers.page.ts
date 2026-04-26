import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';

type Customer = {
  id: number;
  name: string;
  email: string;
};

const STORAGE_KEY = 'customers';
const MOCK_CUSTOMERS: Customer[] = [
  { id: 1, name: 'ABC Corp', email: 'abc@test.com' },
  { id: 2, name: 'XYZ Ltd', email: 'xyz@test.com' },
];

@Component({
  selector: 'app-customers-page',
  template: `
    <section class="page">
      <h1>Customers</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          @for (customer of customers(); track customer.id) {
            <tr>
              <td>{{ customer.name }}</td>
              <td>{{ customer.email }}</td>
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersPage {
  protected readonly customers = signal<Customer[]>(this.loadCustomers());
  private lastPersisted = JSON.stringify(this.customers());

  constructor() {
    effect(() => {
      const serialized = JSON.stringify(this.customers());
      if (serialized === this.lastPersisted) {
        return;
      }

      localStorage.setItem(STORAGE_KEY, serialized);
      this.lastPersisted = serialized;
    });
  }

  private loadCustomers(): Customer[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return MOCK_CUSTOMERS;
    }

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Customer[]) : MOCK_CUSTOMERS;
    } catch {
      return MOCK_CUSTOMERS;
    }
  }
}
