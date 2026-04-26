import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-expenses-page',
    templateUrl: './expenses.page.html',
    styleUrl: './expenses.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesPage { }
