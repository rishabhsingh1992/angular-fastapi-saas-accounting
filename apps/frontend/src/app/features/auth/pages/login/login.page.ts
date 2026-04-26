import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login-page',
    imports: [
        RouterLink,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
    ],
    templateUrl: './login.page.html',
    styleUrl: './login.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly snackBar = inject(MatSnackBar);

    protected readonly showPassword = signal(false);
    protected readonly isLoading = signal(false);
    protected readonly errorMessage = signal('');

    protected readonly loginForm = new FormGroup({
        email: new FormControl('', [
            Validators.required,
            Validators.email,
        ]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),
    });

    protected togglePasswordVisibility(): void {
        this.showPassword.update((v) => !v);
    }

    protected onSubmit(): void {
        if (this.loginForm.invalid || this.isLoading()) return;

        this.loginForm.markAllAsTouched();
        if (this.loginForm.invalid) return;

        this.isLoading.set(true);
        this.errorMessage.set('');

        const { email, password } = this.loginForm.getRawValue();

        this.authService.login(email!, password!).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.router.navigate(['/dashboard']);
            },
            error: () => {
                this.isLoading.set(false);
                this.errorMessage.set(
                    'Invalid email or password. Try rishabh@acmecorp.com / password123'
                );
            },
        });
    }

    protected onForgotPassword(): void {
        this.snackBar.open(
            'Password reset is not available in demo mode.',
            'OK',
            { duration: 3500 }
        );
    }
}
