import 'reflect-metadata';
import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';

export const di = new Container({ autoBindInjectable: true });
di.load(buildProviderModule());
