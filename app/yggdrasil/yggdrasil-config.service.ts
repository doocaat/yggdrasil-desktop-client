import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { SettingService } from '../common/setting.service';
import { CmdService } from '../common/cmd.service';
import { FsService } from '../common/fs.service';

@provide(YggdrasilConfigService)
export class YggdrasilConfigService {
  constructor(
    @inject(SettingService)
    private readonly settingService: SettingService,
    @inject(CmdService)
    private readonly cmdService: CmdService,
    @inject(FsService)
    private readonly fsService: FsService
  ) {}

  saveConfig() {
    const configPath = this.settingService.getConfigPath();

    // this.cmdService.
  }

  readConfig() {
    const configPath = this.settingService.getConfigPath();

   // this.fsService
  }
}
