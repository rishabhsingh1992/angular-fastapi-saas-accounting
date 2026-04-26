import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-reports-page',
  imports: [RouterOutlet],
  template: `
    <section class="page">
      <h1>Reports</h1>
      <p>Nested report routes are rendered below.</p>
      <router-outlet />
    </section>
  `,
  styles: [
    `
      .page {
        padding: 24px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsPage {}
