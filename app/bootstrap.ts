import { di } from './di/container.di';
import { SettingService } from './common/setting.service';

di.get<SettingService>(SettingService);
