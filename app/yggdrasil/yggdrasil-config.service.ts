import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { SettingService } from '../common/setting.service';
import { CmdService } from '../common/cmd.service';
import { FsService } from '../common/fs.service';
import { WindowService } from '../common/window.service';
import { ipcMain } from 'electron';

@provide(YggdrasilConfigService)
export class YggdrasilConfigService {
  constructor(
    @inject(SettingService)
    private readonly settingService: SettingService,
    @inject(CmdService)
    private readonly cmdService: CmdService,
    @inject(FsService)
    private readonly fsService: FsService,
    @inject(WindowService)
    private readonly windowService: WindowService
  ) {
    this.initHandlers();
  }

  initHandlers() {
    ipcMain.on('config:open', (event, arg) => {
      this.open();
    });
  }

  open() {
    console.log('config:open');
    this.windowService.createWindow('#/config/main', true);
  }

  saveConfig() {
    const configPath = this.settingService.getConfigPath();

    // this.cmdService.
  }

  readConfig() {
    const configPath = this.settingService.getConfigPath();

   // this.fsService
  }
}
