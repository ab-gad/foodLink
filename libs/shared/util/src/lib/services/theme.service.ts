import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private readonly platformId = inject(PLATFORM_ID);
    public readonly isDark = signal<boolean>(false);

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            this.isDark.set(savedTheme === 'dark' || (!savedTheme && prefersDark));

            effect(() => {
                const dark = this.isDark();
                if (dark) {
                    document.documentElement.classList.add('dark');
                    // 💡 Explicitly aligns native browser elements (scrollbars, input buttons) to dark mode
                    document.documentElement.style.setProperty('color-scheme', 'dark');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.documentElement.classList.remove('dark');
                    // 💡 Explicitly resets native browser element rendering to light mode
                    document.documentElement.style.setProperty('color-scheme', 'light');
                    localStorage.setItem('theme', 'light');
                }
            });
        }
    }

    public toggleTheme(): void {
        this.isDark.update((dark) => !dark);
    }
}