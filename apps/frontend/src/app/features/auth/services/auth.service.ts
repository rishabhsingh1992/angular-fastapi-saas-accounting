import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string;
    tenantName: string;
}

interface Token {
    access_token: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly router = inject(Router);

    private readonly http = inject(HttpClient);

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
