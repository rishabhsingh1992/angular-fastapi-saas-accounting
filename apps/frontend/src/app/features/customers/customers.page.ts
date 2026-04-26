import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { CustomersService } from './services/customers.service';

@Component({
    selector: 'app-customers-page',
    templateUrl: './customers.page.html',
    styleUrl: './customers.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersPage {
    private readonly customersService = inject(CustomersService);

    protected readonly customers = this.customersService.customers;

    constructor() {
        effect(() => {
            this.customers();
            this.customersService.persistCustomers();
        });
    }
}
