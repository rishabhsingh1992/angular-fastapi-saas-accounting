import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-billing-page',
    templateUrl: './billing.page.html',
    styleUrl: './billing.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingPage { }
