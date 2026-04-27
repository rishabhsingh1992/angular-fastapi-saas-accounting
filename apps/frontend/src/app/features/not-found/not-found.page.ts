import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-not-found-page',
	standalone: true,
	template: '404 – Page not found',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
