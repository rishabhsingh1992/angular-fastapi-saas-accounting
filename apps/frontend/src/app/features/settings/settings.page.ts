import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

type SettingsTab = 'profile' | 'company' | 'appearance' | 'notifications' | 'security' | 'danger';

type NotificationKey =
    | 'newInvoice'
    | 'paymentReceived'
    | 'weeklySummary'
    | 'overdueReminders';

interface NotificationOption {
    key: NotificationKey;
    label: string;
    description: string;
}

@Component({
    selector: 'app-delete-account-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    template: `
        <div style="padding: 1.5rem">
            <h2 mat-dialog-title style="color: var(--mat-sys-error); margin-bottom: 1rem">Delete Account</h2>
            <mat-dialog-content>
                <p>Are you sure you want to delete your account? This action is <strong>permanent</strong> and will remove all your data, including invoices, customers, and reports.</p>
                <p style="margin-top: 1rem; color: var(--mat-sys-on-surface-variant)">This is a mock confirmation dialog. No data will be deleted.</p>
            </mat-dialog-content>
            <mat-dialog-actions align="end" style="margin-top: 1.5rem">
                <button mat-button mat-dialog-close>Cancel</button>
                <button mat-flat-button color="warn" [mat-dialog-close]="true">Confirm Delete</button>
            </mat-dialog-actions>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteAccountDialogComponent { }

@Component({
    selector: 'app-settings-page',
    imports: [
        FormsModule,
        MatCardModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatDialogModule,
    ],
    templateUrl: './settings.page.html',
    styleUrl: './settings.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
    private readonly snackBar = inject(MatSnackBar);
    private readonly dialog = inject(MatDialog);

    protected readonly selectedTab = signal<SettingsTab>('profile');
    protected readonly isSaving = signal(false);

    protected readonly profile = {
        name: 'Rishabh Sharma',
        email: 'rishabh@acmecorp.com',
        phone: '+91 98765 43210',
    };

    protected readonly company = {
        name: 'Acme Corp',
        email: 'hello@acmecorp.com',
        taxId: 'GSTIN123456789',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
    };

    protected readonly appearance = {
        theme: signal<'light' | 'dark'>('light'),
        primaryColor: signal('#6750A4'),
    };

    protected readonly security = {
        twoFactorEnabled: signal(false),
        lastPasswordChange: 'April 12, 2026',
    };

    protected readonly notifications = {
        newInvoice: true,
        paymentReceived: true,
        weeklySummary: false,
        overdueReminders: true,
    };

    protected readonly currencyOptions = ['INR', 'USD', 'EUR', 'GBP'];

    protected readonly timezoneOptions = [
        'Asia/Kolkata',
        'UTC',
        'America/New_York',
        'Europe/London',
        'Europe/Berlin',
        'Asia/Singapore',
    ];

    protected readonly notificationOptions: NotificationOption[] = [
        { 
            key: 'newInvoice', 
            label: 'New Invoice', 
            description: 'Receive an email every time a new invoice is created.' 
        },
        { 
            key: 'paymentReceived', 
            label: 'Payment Received', 
            description: 'Get notified as soon as a customer pays an invoice.' 
        },
        { 
            key: 'weeklySummary', 
            label: 'Weekly Summary', 
            description: 'A digest of your financial performance every Monday.' 
        },
        { 
            key: 'overdueReminders', 
            label: 'Overdue Reminders', 
            description: 'Alerts when invoices pass their due date.' 
        },
    ];

    protected selectTab(tab: SettingsTab): void {
        this.selectedTab.set(tab);
    }

    protected get initials(): string {
        return this.profile.name
            .split(' ')
            .filter((part) => part.length > 0)
            .slice(0, 2)
            .map((part) => part[0])
            .join('')
            .toUpperCase();
    }

    protected saveSettings(section: string): void {
        this.isSaving.set(true);
        // Simulate API call
        setTimeout(() => {
            this.isSaving.set(false);
            this.snackBar.open(`${section} updated successfully`, 'Close', {
                duration: 2500,
                horizontalPosition: 'end',
                verticalPosition: 'top',
                panelClass: ['success-snackbar']
            });
        }, 800);
    }

    protected onNotificationToggle(key: NotificationKey, value: boolean): void {
        this.notifications[key] = value;
    }

    protected toggleTwoFactor(): void {
        this.security.twoFactorEnabled.update(v => !v);
        this.snackBar.open(
            `2FA ${this.security.twoFactorEnabled() ? 'enabled' : 'disabled'}`, 
            'Close', 
            { duration: 2000 }
        );
    }

    protected openDeleteConfirmation(): void {
        this.dialog.open(DeleteAccountDialogComponent, {
            width: '480px',
        });
    }
}
