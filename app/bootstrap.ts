import { di } from './di/container.di';
import { SettingService } from './common/setting.service';
import { WebBrowserService } from './common/web-browser.service';
import { YggdrasilConfigService } from './yggdrasil/yggdrasil-config.service';

di.get<SettingService>(SettingService);
di.get<WebBrowserService>(WebBrowserService);
di.get<YggdrasilConfigService>(YggdrasilConfigService);
