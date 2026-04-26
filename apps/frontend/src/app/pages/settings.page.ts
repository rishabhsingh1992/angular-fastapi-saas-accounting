import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-settings-page',
  template: `
    <section class="page">
      <h1>Settings</h1>
      <p>Configure workspace preferences, users, and integrations.</p>
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
export class SettingsPage {}
