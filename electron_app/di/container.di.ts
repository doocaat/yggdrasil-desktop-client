import 'reflect-metadata';
import { Container } from 'inversify';
import { CONFIG_DI } from './config.di';
import { WindowService } from '../window/interfaces/window.service';
import { ElectronWindowService } from '../window/electron-window.service';
import { ElectronTrayService } from '../window/electron-tray.service';
import { TrayService } from '../window/interfaces/tray.service';
import { YggdrasilService } from '../yggdrasil/yggdrasil.service';
import { FsService } from '../common/fs.service';


export const di = new Container({ autoBindInjectable: true });
di.bind<WindowService>(CONFIG_DI.WindowService).to(ElectronWindowService);
di.bind<TrayService>(CONFIG_DI.TrayService).to(ElectronTrayService);
di.bind<YggdrasilService>(CONFIG_DI.YggdrasilService).to(YggdrasilService);
di.bind<FsService>(CONFIG_DI.FsService).to(FsService);
