import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BackendHealthResponse } from '../models/health.models';

@Injectable({
    providedIn: 'root',
})
export class BackendHealthService {
    private readonly http = inject(HttpClient);
    private readonly healthUrl = `${environment.apiBaseUrl}/api/health`;

    checkHealth(): Observable<BackendHealthResponse> {
        return this.http.get<BackendHealthResponse>(this.healthUrl);
    }
}
