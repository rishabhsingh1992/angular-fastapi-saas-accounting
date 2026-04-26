import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DashboardService } from './services/dashboard.service';
import { BackendHealthService } from '../../core/services/backend-health.service';
import { BackendHealthResponse } from '../../core/models/health.models';

@Component({
    selector: 'app-dashboard-page',
    templateUrl: './dashboard.page.html',
    styleUrl: './dashboard.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
    private readonly dashboardService = inject(DashboardService);
    private readonly backendHealthService = inject(BackendHealthService);

    protected readonly summary = this.dashboardService.summary;
    protected readonly healthStatus = signal<'loading' | 'up' | 'down'>('loading');
    protected readonly healthMessage = signal('Checking backend connection...');

    constructor() {
        this.refreshHealth();
    }

    protected refreshHealth(): void {
        this.healthStatus.set('loading');
        this.healthMessage.set('Checking backend connection...');

        this.backendHealthService.checkHealth().subscribe({
            next: (response) => this.onHealthSuccess(response),
            error: () => this.onHealthError(),
        });
    }

    private onHealthSuccess(response: BackendHealthResponse): void {
        this.healthStatus.set('up');
        this.healthMessage.set(`${response.service} v${response.version} (${response.environment})`);
    }

    private onHealthError(): void {
        this.healthStatus.set('down');
        this.healthMessage.set('Backend is unreachable. Confirm API server is running on port 8000.');
    }
}
