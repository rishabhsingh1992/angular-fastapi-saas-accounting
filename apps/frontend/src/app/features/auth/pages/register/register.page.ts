import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register-page',
    imports: [RouterLink, ReactiveFormsModule],
    templateUrl: './register.page.html',
    styleUrl: './register.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    protected readonly isLoading = signal(false);
    protected readonly errorMessage = signal('');

    protected readonly registerForm = new FormGroup({
        full_name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        role: new FormControl('manager', [Validators.required]),
    });

    protected onSubmit(): void {
        this.registerForm.markAllAsTouched();
        if (this.registerForm.invalid || this.isLoading()) return;

        this.isLoading.set(true);
        this.errorMessage.set('');

        const { email, password, full_name, role } = this.registerForm.getRawValue();

        this.authService.register({
            email: email!,
            password: password!,
            full_name: full_name!,
            role: role!,
        }).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.router.navigate(['/login']);
            },
            error: () => {
                this.isLoading.set(false);
                this.errorMessage.set('Unable to create account. Please try again.');
            },
        });
    }
}
