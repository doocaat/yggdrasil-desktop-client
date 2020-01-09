import { BrowserWindow, screen } from 'electron';
import { provide } from 'inversify-binding-decorators';
import { WindowTools } from './tools/window.tools';

@provide(WindowService)
export class WindowService {
  private serve;

  constructor() {
    const args = process.argv.slice(1);
    this.serve = args.some(val => val === '--serve');
  }

  sendAllWindow(channel: string, data?: any) {
    BrowserWindow.getAllWindows()
    .forEach(window => {
      window.webContents.send(channel, data);
    });
  }

  createWindow(windowUrl: string, show = false, width?: number, height?: number) {
    const electronScreen = screen;
    const workArea = electronScreen.getPrimaryDisplay().workAreaSize;
    if (!width) {
      width = workArea.width;
    }

    if (!height) {
      height = workArea.height;
    }

    const window = new BrowserWindow({
      x: 0,
      y: 0,
      width,
      height,
      webPreferences: {
        nodeIntegration: true,
        sandbox: false,
        webSecurity: false
      },
      show: show
    });

    // Emitted when the window is closed.
    window.on('closed', () => {
      // Dereference the window object, usually you would store window
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
    });

    window.loadURL(WindowTools.getUrl() + windowUrl);

    return window;
  }
}
