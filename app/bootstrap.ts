import { di } from './di/container.di';
import { ConfigService } from './common/config.service';

di.get<ConfigService>(ConfigService);
