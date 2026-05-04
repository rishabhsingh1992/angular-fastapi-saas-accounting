import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

type BillingTab = 'subscription' | 'payment-methods' | 'invoice-history';

interface Plan {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
    popular: boolean;
    cta: string;
}

interface PaymentMethod {
    id: number;
    brand: string;
    last4: string;
    expiry: string;
    isDefault: boolean;
}

interface BillingInvoice {
    id: string;
    date: string;
    plan: string;
    amount: number;
    status: 'Paid' | 'Failed' | 'Pending';
}

const PLANS: Plan[] = [
    {
        id: 'starter',
        name: 'Starter',
        price: 0,
        description: 'For individuals and freelancers',
        features: ['5 invoices / month', '1 team member', '1 GB storage', 'Basic reports'],
        popular: false,
        cta: 'Downgrade',
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 999,
        description: 'For growing businesses',
        features: ['500 invoices / month', 'Up to 10 team members', '10 GB storage', 'Advanced reports', 'Priority support'],
        popular: true,
        cta: 'Current Plan',
    },
    {
        id: 'business',
        name: 'Business',
        price: 2499,
        description: 'For large teams and agencies',
        features: ['Unlimited invoices', 'Unlimited team members', '100 GB storage', 'Custom reports', 'Dedicated support', 'API access'],
        popular: false,
        cta: 'Upgrade',
    },
];

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
    { id: 1, brand: 'Visa', last4: '4242', expiry: '12/27', isDefault: true },
    { id: 2, brand: 'Mastercard', last4: '5555', expiry: '08/26', isDefault: false },
];

const MOCK_INVOICES: BillingInvoice[] = [
    { id: 'BILL-2026-04', date: '2026-04-01', plan: 'Pro Plan', amount: 999, status: 'Paid' },
    { id: 'BILL-2026-03', date: '2026-03-01', plan: 'Pro Plan', amount: 999, status: 'Paid' },
    { id: 'BILL-2026-02', date: '2026-02-01', plan: 'Pro Plan', amount: 999, status: 'Paid' },
    { id: 'BILL-2026-01', date: '2026-01-01', plan: 'Starter Plan', amount: 0, status: 'Paid' },
    { id: 'BILL-2025-12', date: '2025-12-01', plan: 'Pro Plan', amount: 999, status: 'Failed' },
    { id: 'BILL-2025-11', date: '2025-11-01', plan: 'Pro Plan', amount: 999, status: 'Paid' },
];

@Component({
    selector: 'app-billing-page',
    imports: [
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSnackBarModule,
        MatTooltipModule,
    ],
    templateUrl: './billing.page.html',
    styleUrl: './billing.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingPage {
    private readonly snackBar = inject(MatSnackBar);

    protected readonly selectedTab = signal<BillingTab>('subscription');
    protected readonly showAddCard = signal(false);
    protected readonly paymentMethods = signal<PaymentMethod[]>([...MOCK_PAYMENT_METHODS]);

    protected readonly cardName = signal('');
    protected readonly cardNumber = signal('');
    protected readonly cardExpiry = signal('');
    protected readonly cardCvv = signal('');

    protected readonly currentPlanId = 'pro';
    protected readonly plans = PLANS;
    protected readonly invoices = MOCK_INVOICES;

    protected selectTab(tab: BillingTab): void {
        this.selectedTab.set(tab);
    }

    protected usagePercent(used: number, total: number): number {
        return Math.round((used / total) * 100);
    }

    protected selectPlan(plan: Plan): void {
        if (plan.id === this.currentPlanId) return;
        const msg = plan.id === 'business'
            ? 'Contact sales to upgrade to Business'
            : 'Plan change coming soon';
        this.snackBar.open(msg, 'Close', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' });
    }

    protected setDefault(id: number): void {
        this.paymentMethods.update(list => list.map(m => ({ ...m, isDefault: m.id === id })));
    }

    protected removeCard(id: number): void {
        this.paymentMethods.update(list => list.filter(m => m.id !== id));
        this.snackBar.open('Card removed', 'Close', { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
    }

    protected addCard(): void {
        const name = this.cardName().trim();
        const number = this.cardNumber().trim();
        const expiry = this.cardExpiry().trim();
        if (!name || number.length < 4 || !expiry) return;

        this.paymentMethods.update(list => [
            ...list,
            {
                id: Date.now(),
                brand: 'Visa',
                last4: number.slice(-4),
                expiry,
                isDefault: list.length === 0,
            },
        ]);
        this.cardName.set('');
        this.cardNumber.set('');
        this.cardExpiry.set('');
        this.cardCvv.set('');
        this.showAddCard.set(false);
        this.snackBar.open('Card added', 'Close', { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
    }

    protected cancelAddCard(): void {
        this.cardName.set('');
        this.cardNumber.set('');
        this.cardExpiry.set('');
        this.cardCvv.set('');
        this.showAddCard.set(false);
    }

    protected downloadInvoice(invoice: BillingInvoice): void {
        this.snackBar.open(`Downloading ${invoice.id}…`, 'Close', {
            duration: 2200,
            horizontalPosition: 'end',
            verticalPosition: 'top',
        });
    }

    protected formatDate(iso: string): string {
        return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    protected statusClass(status: string): string {
        return `status-chip-${status.toLowerCase()}`;
    }
}
