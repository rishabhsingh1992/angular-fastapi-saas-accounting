import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-reports-finance-page',
    templateUrl: './reports-finance.page.html',
    styleUrl: './reports-finance.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsFinancePage { }
