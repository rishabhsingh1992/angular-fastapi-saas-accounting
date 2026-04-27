import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

export interface UserRead {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string;
    tenantName: string;
}

export type User = UserRead;

interface Token {
    access_token: string;
}

interface RegisterPayload {
    email: string;
    password: string;
    full_name: string;
    role: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly router = inject(Router);

    private readonly http = inject(HttpClient);

    private readonly currentUserState = signal<UserRead | null>(this.loadStoredCurrentUser());

    constructor() {
        if (this.getToken()) {
            this.fetchCurrentUser().subscribe({
                error: () => {
                    this.currentUserState.set(null);
                    localStorage.removeItem('auth_user');
                },
            });
        }
    }

    login(email: string, password: string): Observable<boolean> {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        return this.http.post<Token>('/auth/login', formData).pipe(
            map(({ access_token }) => {
                localStorage.setItem('auth_token', access_token);
                return true;
            })
        );
    }

    register(payload: RegisterPayload): Observable<UserRead> {
        return this.http.post<UserRead>('/auth/register', {
            ...payload,
            tenant_id: 'acme-corp',
        });
    }

    fetchCurrentUser(): Observable<UserRead> {
        return this.http.get<UserRead>('/auth/me').pipe(
            tap((user) => {
                this.currentUserState.set(user);
                localStorage.setItem('auth_user', JSON.stringify(user));
            })
        );
    }

    logout(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        this.router.navigate(['/login']);
    }

    getCurrentUser(): UserRead | null {
        return this.currentUserState();
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('auth_token');
    }

    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    private loadStoredCurrentUser(): UserRead | null {
        const raw = localStorage.getItem('auth_user');
        if (!raw) return null;

        try {
            return JSON.parse(raw) as UserRead;
        } catch {
            return null;
        }
    }
}
