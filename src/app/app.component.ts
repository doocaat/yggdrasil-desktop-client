import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { ConfigService } from './config/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private configService: ConfigService,
    private zone: NgZone
  ) {
    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);
    
      this.configService.configApp.subscribe(config => {
        if (!!config) {
          this.translate.use(config.language);
        //  this.changeDetectorRef.detectChanges();
        }
      });

      this.configService.loadConfig();

      this.electronService.ipcRenderer.on('language', (event, args) => {
        this.zone.run(() => {
          this.translate.use(args);
        });
       // this.changeDetectorRef.detectChanges();
      });

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }
}
