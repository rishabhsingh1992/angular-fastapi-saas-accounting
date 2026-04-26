import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiConfig } from '../config/api.config';

export interface BackendHealthResponse {
    status: string;
    service: string;
    version: string;
    environment: string;
}

@Injectable({
    providedIn: 'root',
})
export class BackendHealthService {
    private readonly http = inject(HttpClient);
    private readonly healthUrl = `${apiConfig.baseUrl}/api/health`;

    checkHealth(): Observable<BackendHealthResponse> {
        return this.http.get<BackendHealthResponse>(this.healthUrl);
    }
}
