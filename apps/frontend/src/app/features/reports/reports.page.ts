import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-reports-page',
    imports: [RouterOutlet],
    templateUrl: './reports.page.html',
    styleUrl: './reports.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsPage { }
