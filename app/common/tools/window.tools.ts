
import * as url from 'url';
import * as path from 'path';

export class WindowTools {
    static getUrl(): string {
        const args = process.argv.slice(1);
        const serve = args.some(val => val === '--serve');

        if (serve) {
            require('electron-reload')(__dirname, {
              electron: require(`${__dirname}/../../../../node_modules/electron`)
            });
            return 'http://localhost:4200';
          } else {
            return url.format({
              pathname: path.join(__dirname, '/../../dist/ui/index.html'),
              protocol: 'file:',
              slashes: true
            });
          }
    }
}
