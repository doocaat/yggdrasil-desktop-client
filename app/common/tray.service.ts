import { inject } from 'inversify';
import {
  app,
  Tray,
  Menu,
  nativeImage,
  MenuItemConstructorOptions,
  NativeImage
} from 'electron';
import * as path from 'path';
import { provide } from 'inversify-binding-decorators';
import { WindowService } from './window.service';

@provide(TrayService)
export class TrayService {
  private tray: Tray;
  private menu: Menu;

  constructor(
    @inject(WindowService)
    private readonly windowService: WindowService
  ) {}

  getMenu(): MenuItemConstructorOptions[] {
    return [
      {
        label: 'Config',
        click: () => {
          this.windowService.openWindow('#/config/main');
        }
      },
      {
        label: 'Admin',
        click: () => {
          this.windowService.openWindow('#/admin/main');
        }
      },
      {
        label: 'Exit',
        click: () => {
          app.quit();
        }
      }
    ];
  }

  getTrayIcon(name: string): NativeImage {
    const iconPath = path.join(`${__dirname}/../../ui/assets/tray/${name}.png`);
    return nativeImage.createFromPath(iconPath);
  }

  createTray(): void {
    if (!!this.tray) {
      return;
    }

    this.menu = Menu.buildFromTemplate(this.getMenu());

    this.tray = new Tray(this.getTrayIcon('connected'));
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
