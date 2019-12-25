import { injectable } from 'inversify';
import * as url from 'url';
import * as path from 'path';
import { BrowserWindow, screen } from 'electron';
import { provide } from 'inversify-binding-decorators';

@provide(ConfigService)
export class ConfigService {

}
