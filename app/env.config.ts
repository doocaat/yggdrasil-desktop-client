import { provide } from 'inversify-binding-decorators';

@provide(EnvConfig)
export class EnvConfig {
    availableLanguage = [
        {
            name: 'English',
            code: 'en',
        },
        {
            name: 'Русский',
            code: 'ru',
        }
    ];
    defaultLanguage = 'en';
    peerAddress: 'tcp://localhost:9091';
    proxy = {
       host: 'localhost',
       port: 5050,
       zones: ['.ygg', '.medium', '.ea', '.um', '.hub', '.dns']
    };
    dns = {
        servers: [
            {
                name: 'Wyrd: Saint Petersburg, Russia',
                address: '303:8b1a::53',
            },
            {
                name: 'Wyrd: Praha, Czechia',
                address: '301:2522::53',
            },
            {
                name: 'Wyrd: Bratislava, Slovakia',
                address: '301:2923::53',
            },
            {
                name: 'Wyrd: Naaldwijk, Netherlands',
                address: '300:4523::53',
            },
        ]
    };
}
