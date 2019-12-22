import { BrowserWindow } from "electron";


export interface WindowService {
    getWindowUrl(): string;

    createWindow(): void;

    openWindow(url?: string): void;

    getWindow(): BrowserWindow | null;

    closeWindow(): void;
}
