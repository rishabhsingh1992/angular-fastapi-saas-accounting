import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-shell',
  template: `
    <section class="page">
      <h1>{{ title() }}</h1>
      <p>{{ description() }}</p>
    </section>
  `,
  styles: [
    `
      .page {
        padding: 24px;
      }

      h1 {
        margin-top: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageShellComponent {
  title = input.required<string>();
  description = input<string>('');
}
