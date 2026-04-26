import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-register-page',
    imports: [RouterLink],
    template: `
    <section class="auth-wrap">
      <article class="auth-card">
        <p class="eyebrow">Get started</p>
        <h1>Create your account</h1>
        <p class="subtitle">Set up your workspace and invite your finance team later.</p>

        <form class="auth-form" novalidate>
          <label>
            <span>Full name</span>
            <input type="text" placeholder="Your name" autocomplete="name" />
          </label>

          <label>
            <span>Work email</span>
            <input type="email" placeholder="name@company.com" autocomplete="email" />
          </label>

          <label>
            <span>Password</span>
            <input type="password" placeholder="Create password" autocomplete="new-password" />
          </label>

          <button type="submit">Create account</button>
        </form>

        <p class="switch-link">
          Already have an account?
          <a routerLink="/login">Sign in</a>
        </p>
      </article>
    </section>
  `,
    styles: [
        `
      .auth-wrap {
        min-height: calc(100vh - 64px);
        display: grid;
        place-items: center;
        padding: 24px;
        background:
          radial-gradient(circle at top left, rgba(16, 185, 129, 0.13), transparent 50%),
          radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.1), transparent 55%);
      }

      .auth-card {
        width: min(460px, 100%);
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        box-shadow: 0 12px 40px rgba(15, 23, 42, 0.08);
        padding: 28px;
      }

      .eyebrow {
        margin: 0 0 8px;
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #0f766e;
        font-weight: 700;
      }

      h1 {
        margin: 0;
        color: #0f172a;
        font-size: 1.5rem;
      }

      .subtitle {
        margin: 8px 0 20px;
        color: #475569;
      }

      .auth-form {
        display: grid;
        gap: 14px;
      }

      label {
        display: grid;
        gap: 6px;
      }

      label span {
        color: #334155;
        font-size: 0.9rem;
        font-weight: 600;
      }

      input {
        height: 42px;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        padding: 0 12px;
        outline: none;
      }

      input:focus {
        border-color: #0f766e;
        box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.18);
      }

      button {
        height: 44px;
        margin-top: 4px;
        border: 0;
        border-radius: 10px;
        background: linear-gradient(135deg, #0f766e, #0ea5e9);
        color: #ffffff;
        font-weight: 700;
        cursor: pointer;
      }

      .switch-link {
        margin: 18px 0 0;
        color: #64748b;
      }

      .switch-link a {
        color: #0f766e;
        text-decoration: none;
        font-weight: 700;
      }
    `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage { }