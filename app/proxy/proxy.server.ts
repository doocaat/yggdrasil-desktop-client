import { provide } from 'inversify-binding-decorators';
import * as url from 'url';
import { inject } from 'inversify';
import * as Proxy from 'http-mitm-proxy';
import { DnsService } from '../dns/dns.service';
import {
  DomainNameServerConnection,
  RequestRecordType,
  DnsAnswer
} from './types';
import { IpUtil } from './ip.util';
import { IProxy } from 'http-mitm-proxy';
import { SettingService } from '../common/setting.service';

@provide(ProxyServer)
export class ProxyServer {
  private proxy: IProxy;

  constructor(@inject(DnsService) private readonly dnsService: DnsService,
              @inject(SettingService) private readonly settingService: SettingService) {}

  async start() {
    if (this.proxy) {
      this.stop();
    }

    this.proxy = Proxy();
    const { gunzip, wildcard } = Proxy;
    this.proxy.use(gunzip);
    this.proxy.use(wildcard);

    this.subscribeToEvents();

    const proxyOptions = {
      port: this.settingService.getProxyPort(),
      host: this.settingService.getProxyHost()
    };

    this.proxy.listen(proxyOptions, () => {
      console.log(`proxy: server listen on ${proxyOptions.host}:${proxyOptions.port}`);
    });
  }

  stop() {
    if (this.proxy) {
      this.proxy.close();
      console.log(`proxy: server stop`);
    }
  }

  isHostSupportZone(host: string): boolean {
    const result = this.settingService.getProxyZones().find(zone => host.endsWith(zone));
    return !!result;
  }

  private async getTarget(targetUrl: string) {
    console.log(`proxy: request url - ${targetUrl}`);
    const targetURL = url.parse(targetUrl);

    let targetHost = targetURL.host;

    if (
      !!targetHost &&
      !IpUtil.isIp(targetHost) &&
      this.isHostSupportZone(targetHost)
    ) {
      try {
        const dnsRequestResult = await this.requestDns(targetHost);
        if (!!dnsRequestResult && !!dnsRequestResult.data) {
          if (IpUtil.isIpV6(dnsRequestResult.data)) {
            targetHost = `[${dnsRequestResult.data}]`;
          } else {
            targetHost = dnsRequestResult.data;
          }
        }
      } catch (e) {
        console.warn(e);
      }
    }

    const target =
      (!!targetURL.protocol ? targetURL.protocol + '//' : '') +
      targetHost +
      (!!targetURL.port ? ':' + targetURL.port : '');
    console.log(`proxy: target - ${target}`);
    return target;
  }

  private async subscribeToEvents() {
    this.proxy = Proxy();
    const { gunzip } = Proxy;
    this.proxy.use(gunzip);

    this.proxy.onError((ctx, err) => {
      console.error('error: ', err);
    });

    this.proxy.onRequest(async (ctx, callback) => {
      const targetURL =
        ctx.proxyToServerRequestOptions.agent['protocol'] +
        '//' +
        ctx.proxyToServerRequestOptions.headers.host;
      const target = url.parse(await this.getTarget(targetURL));

      ctx.proxyToServerRequestOptions.host = IpUtil.format(target.host);
      callback(null);
    });

    this.proxy.onWebSocketConnection(async (ctx, callback) => {

      const sourceURL =
      (ctx.isSSL ? 'https:' : 'http:') + '//' + ctx.clientToProxyWebSocket.upgradeReq.headers.host;

      const target = url.parse(await this.getTarget(sourceURL));

      const targetUrl =
        (ctx.isSSL ? 'wss' : 'ws') +
        '://' +
        target.host +
        (target.port ? ':' + target.port : '') +
        ctx.clientToProxyWebSocket.upgradeReq.url;

        ctx.clientToProxyWebSocket.upgradeReq.url = targetUrl;
        ctx['proxyToServerWebSocketOptions'].url = targetUrl;
        console.log('proxy: websocket connection to url:', targetUrl);
      return callback();
    });
  }

  private async requestDns(host: string): Promise<DnsAnswer> {
    return this.dnsService.resolve(host, RequestRecordType.AAAA);
  }
}
