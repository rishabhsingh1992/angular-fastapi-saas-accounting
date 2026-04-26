import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private readonly isDark = signal<boolean>(false);

    constructor() {
        const saved = localStorage.getItem('theme');

        if (!saved) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (prefersDark) {
                this.enableDark();
                return;
            }

            this.enableLight(false);
            return;
        }

        if (saved === 'dark') {
            this.enableDark();
            return;
        }

        this.enableLight(false);
    }

    toggleTheme(): void {
        this.isDark() ? this.enableLight() : this.enableDark();
    }

    enableDark(): void {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        this.isDark.set(true);
    }

    enableLight(persist = true): void {
        document.body.classList.remove('dark-theme');

        if (persist) {
            localStorage.setItem('theme', 'light');
        }

        this.isDark.set(false);
    }

    isDarkMode(): Signal<boolean> {
        return this.isDark.asReadonly();
    }
}