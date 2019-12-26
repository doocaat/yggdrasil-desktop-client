import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ConfigService } from '../../config/config.service';
import { ElectronService } from '../../core/services/electron/electron.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  setting: any = null;

  settingForm = new FormGroup({
    configPath: new FormControl(''),
    peerAddress: new FormControl(''),
    language: new FormControl(''),
    yggdrasilBinPath: new FormControl(''),
    yggdrasilCtlBinPath: new FormControl(''),
  });

  constructor(
    public configService: ConfigService,
    private electronService: ElectronService,
    private changeDetectorRef: ChangeDetectorRef,
    private zone: NgZone,
    ) { }

  ngOnInit() {

    this.configService.configApp.subscribe(setting => {
      console.log(setting);
      this.zone.run(() => {
        this.setting = setting;
        if (!!setting) {
          this.settingForm.patchValue(setting);
        }
      });
    });

    this.configService.loadConfig();
  }


  saveConfig() {

    const setting = Object.assign(this.setting, this.settingForm.getRawValue());

    this.electronService.ipcRenderer.send('setSetting', setting);
  }
}
