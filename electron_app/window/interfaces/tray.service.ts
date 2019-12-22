import { Tray, Menu } from "electron";


export interface TrayService {
    createTray(): void;

    getTray(): Tray;

    getTrayMenu(): Menu;
}