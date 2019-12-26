import { provide } from 'inversify-binding-decorators';

@provide(EnvConfig)
export class EnvConfig {
    availableLanguage: [
        {
            name: 'English',
            code: 'en',
        },
        {
            name: 'Русский',
            code: 'ru',
        }
    ];
    defaultLanguage: 'en';
}
