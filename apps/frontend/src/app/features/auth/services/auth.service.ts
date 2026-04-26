import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError, delay } from 'rxjs';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string;
    tenantName: string;
}

interface MockUser extends User {
    password: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly router = inject(Router);

    private readonly mockUsers: MockUser[] = [
        {
            id: 'u1',
            name: 'Rishabh Sharma',
            email: 'rishabh@acmecorp.com',
            password: 'password123',
            role: 'owner',
            tenantId: 't1',
            tenantName: 'Acme Corp',
        },
        {
            id: 'u2',
            name: 'Priya Mehta',
            email: 'priya@globex.com',
            password: 'password123',
            role: 'admin',
            tenantId: 't2',
            tenantName: 'Globex Ltd',
        },
    ];

    login(email: string, password: string): Observable<boolean> {
        const match = this.mockUsers.find(
            (u) => u.email === email && u.password === password
        );

        if (!match) {
            return throwError(() => new Error('Invalid credentials'));
        }

        const { password: _pw, ...user } = match;
        localStorage.setItem('auth_token', 'mock-jwt-token');
        localStorage.setItem('auth_user', JSON.stringify(user));

        return of(true).pipe(delay(800));
    }

    logout(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        this.router.navigate(['/login']);
    }

    getCurrentUser(): User | null {
        const raw = localStorage.getItem('auth_user');
        if (!raw) return null;
        try {
            return JSON.parse(raw) as User;
        } catch {
            return null;
        }
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('auth_token');
    }

    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }
}
