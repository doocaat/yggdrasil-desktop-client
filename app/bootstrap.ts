import { di } from './di/container.di';
import { SettingService } from './common/setting.service';
import { WebBrowserService } from './common/web-browser.service';
import { YggdrasilConfigService } from './yggdrasil/yggdrasil-config.service';
import { DAppsService } from './common/dapps.service';

di.get<SettingService>(SettingService);
di.get<WebBrowserService>(WebBrowserService);
di.get<YggdrasilConfigService>(YggdrasilConfigService);
di.get<DAppsService>(DAppsService);
