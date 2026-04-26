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

type SettingsTab = 'profile' | 'company' | 'notifications' | 'danger';

type NotificationKey =
    | 'newInvoice'
    | 'paymentReceived'
    | 'weeklySummary'
    | 'overdueReminders';

interface NotificationOption {
    key: NotificationKey;
    label: string;
}

@Component({
    selector: 'app-delete-account-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    template: `
        <h2 mat-dialog-title>Delete Account</h2>
        <mat-dialog-content>
            This is a mock confirmation dialog. Your account will not be deleted.
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close>Cancel</button>
            <button mat-flat-button color="warn" [mat-dialog-close]="true">Confirm Delete</button>
        </mat-dialog-actions>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteAccountDialogComponent { }

@Component({
    selector: 'app-settings-page',
    imports: [
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
        { key: 'newInvoice', label: 'Email notifications on new invoice' },
        { key: 'paymentReceived', label: 'Email notifications on payment received' },
        { key: 'weeklySummary', label: 'Weekly summary report' },
        { key: 'overdueReminders', label: 'Overdue invoice reminders' },
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

    protected saveProfile(): void {
        this.showSaveMessage();
    }

    protected saveCompany(): void {
        this.showSaveMessage();
    }

    protected saveNotifications(): void {
        this.showSaveMessage();
    }

    protected onNotificationToggle(key: NotificationKey, value: boolean): void {
        this.notifications[key] = value;
    }

    protected openDeleteConfirmation(): void {
        this.dialog.open(DeleteAccountDialogComponent, {
            width: '420px',
        });
    }

    private showSaveMessage(): void {
        this.snackBar.open('Settings saved!', 'Close', {
            duration: 2500,
            horizontalPosition: 'end',
            verticalPosition: 'top',
        });
    }
}
