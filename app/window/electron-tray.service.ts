import 'reflect-metadata';
import { TrayService } from './interfaces/tray.service';
import { injectable } from 'inversify';
import { WindowService } from './interfaces/window.service';
import {
    app,
    Tray,
    Menu,
    nativeImage  } from 'electron';
import * as path from 'path';
import { di } from '../di/container.di';
import { CONFIG_DI } from '../di/config.di';

@injectable()
export class ElectronTrayService implements TrayService {

    private tray: Tray;
    private menu: Menu;
    private readonly windowService: WindowService;

    constructor() {
        this.windowService = di.get<WindowService>(CONFIG_DI.WindowService);
    }

    createTray(): void {

        if (!!this.tray) {
            return;
        }

        const trayIconPath = path.join(`${__dirname}/../../ui/assets/tray/connected.png`
          );

          const trayIconImage = nativeImage.createFromPath(trayIconPath);

          const trayMenuTemplate = [
            {
              label: 'Config',
              click: () => {
               this.windowService.openWindow('#/config/info');
              }
            },
            {
              label: 'Admin',
              click: () => {
                this.windowService.openWindow('#/config/info');
              }
            },
            {
              label: 'Exit',
              click: () => {
                app.quit();
              }
            }
          ];
          this.menu = Menu.buildFromTemplate(trayMenuTemplate);

          this.tray = new Tray(trayIconImage);
          this.tray.setContextMenu(this.menu);

          this.tray.setToolTip('Right Click Icon for Options.');
          this.tray.setTitle('Title');

          this.tray.on('click', (ev, bounds) => {
            // Click event bounds
            const { x, y } = bounds;
            // Window height & width
            const { height, width } = this.windowService.getWindow().getBounds();

            if (this.windowService.getWindow().isVisible()) {
              this.windowService.getWindow().hide();
            } else {
              /////////////////////////////////////////////////////////////////////////////////////////////
              // On Windows I had to parseInt the corrdinates
              /////////////////////////////////////////////////////////////////////////////////////////////
              const yPosition = process.platform === 'darwin' ? y : y - height;
              const xPosition =
                process.platform === 'darwin' ? x - width / 2 : x - width / 2;

                this.windowService.getWindow().setBounds({
                x: Math.floor(xPosition),
                y: Math.floor(yPosition),
                height,
                width
              });

              this.windowService.getWindow().show();
            }
          });
    }

    getTray(): Tray {
        return this.tray;
    }
    getTrayMenu(): Menu {
        return this.menu;
    }
}
