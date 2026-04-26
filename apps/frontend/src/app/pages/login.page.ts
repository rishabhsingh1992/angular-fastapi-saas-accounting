import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-login-page',
    imports: [RouterLink],
    template: `
    <section class="auth-wrap">
      <article class="auth-card">
        <p class="eyebrow">Welcome back</p>
        <h1>Sign in to your workspace</h1>
        <p class="subtitle">Use your company email and password to continue.</p>

        <form class="auth-form" novalidate>
          <label>
            <span>Email</span>
            <input type="email" placeholder="name@company.com" autocomplete="email" />
          </label>

          <label>
            <span>Password</span>
            <input type="password" placeholder="Enter password" autocomplete="current-password" />
          </label>

          <button type="submit">Sign in</button>
        </form>

        <p class="switch-link">
          New to the platform?
          <a routerLink="/register">Create an account</a>
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
          radial-gradient(circle at top right, rgba(56, 189, 248, 0.12), transparent 45%),
          radial-gradient(circle at bottom left, rgba(249, 115, 22, 0.1), transparent 55%);
      }

      .auth-card {
        width: min(420px, 100%);
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
        color: #2563eb;
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
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
      }

      button {
        height: 44px;
        margin-top: 4px;
        border: 0;
        border-radius: 10px;
        background: linear-gradient(135deg, #2563eb, #0ea5e9);
        color: #ffffff;
        font-weight: 700;
        cursor: pointer;
      }

      .switch-link {
        margin: 18px 0 0;
        color: #64748b;
      }

      .switch-link a {
        color: #2563eb;
        text-decoration: none;
        font-weight: 700;
      }
    `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage { }