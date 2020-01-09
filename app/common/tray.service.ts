import { inject } from 'inversify';
import {
  nativeImage,
  NativeImage,
  App as ElectronApp
} from 'electron';
import * as path from 'path';
import { provide } from 'inversify-binding-decorators';
import { WindowService } from './window.service';
import { Menubar } from 'menubar';
import { WindowTools } from './tools/window.tools';

@provide(TrayService)
export class TrayService {
  private menuBar: Menubar;

  constructor(
    @inject(WindowService)
    private readonly windowService: WindowService
  ) {}

  getTrayIcon(name: string): NativeImage {
    const iconPath = path.join(`${__dirname}/../../ui/assets/tray/${name}.png`);
    return nativeImage.createFromPath(iconPath);
  }

  createTray(application: ElectronApp): void {
    this.menuBar = new Menubar(application, {
      icon: this.getTrayIcon('connected'),
      tooltip: 'Yggdrasil',
      showDockIcon: true,
      showOnAllWorkspaces: true,
      preloadWindow: true,
      browserWindow: {
        transparent: true,
        resizable: true,
        webPreferences: {
          nodeIntegration: true,
          sandbox: false,
          webSecurity: false,
        }
      },
      index: WindowTools.getUrl() + '#/menubar'
    });

    this.menuBar.on('after-create-window', () => {
      const window = this.menuBar.window as any;
      window.openDevTools();
    });
  }
}
