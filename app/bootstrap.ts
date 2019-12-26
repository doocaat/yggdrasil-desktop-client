import { di } from './di/container.di';
import { ConfigService } from './common/config.service';
import { SettingService } from './common/setting.service';

di.get<ConfigService>(ConfigService);
di.get<SettingService>(SettingService);
