import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-reports-sales-page',
    templateUrl: './reports-sales.page.html',
    styleUrl: './reports-sales.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsSalesPage { }
