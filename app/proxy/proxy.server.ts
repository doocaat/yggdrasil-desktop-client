import { provide } from 'inversify-binding-decorators';
import * as httpProxy from 'http-proxy';
import * as url from 'url';
import * as http from 'http';
import * as io from 'socket.io';
import { inject } from 'inversify';
import { DnsService } from '../dns/dns.service';
import {
  DomainNameServerConnection,
  RequestRecordType,
  DnsAnswer
} from './types';
import { IpUtil } from './ip.util';

@provide(ProxyServer)
export class ProxyServer {
  private proxy;
  private wsProxy;
  private server;
  private webSocketServer;

  public port = 8080;

  public host: 'localhost';

  zones = ['.ygg', '.medium', '.ea', '.um', '.hub', '.dns'];

  constructor(@inject(DnsService) private readonly dnsService: DnsService) {}

  async start() {
    if (this.proxy || this.server) {
      this.stop();
    }

    await this.startProxy();
    await this.startHttpServer();
  }

  stop() {
    if (this.proxy) {
      this.proxy.close();
    }

    if (this.server) {
      this.server.close();
    }
  }

  private async startHttpServer(): Promise<void> {
    this.server = http.createServer(async (req, res) => {
      const target = await this.getTarget(req.url);
      this.proxy.web(req, res, {
        target,
        ws: true,
        changeOrigin: true,
        hostRewrite: true,
        autoRewrite: true,
        protocolRewrite: true,
        followRedirects: true
      });
    });

    this.server.on('request', (req, res) => {
      console.log('proxy: server request', req.url);
    });

    this.server.on('connect', async (req, socket, head) => {
      console.log('proxy: server connection host', req.url);
      // console.log('proxy: server connection method', req.method);
      // console.log('proxy: server connection rawHeaders', req.rawHeaders);
      // console.log('proxy: server connection trailers', req.trailers);
    });

    this.server.on('upgrade', async (req, socket, head) => {
      console.log('proxy: connection upgrade to ws: ', req.url);
      console.log('proxy http headers: ', req.headers);
      const target = await this.getTarget(req.headers.host + req.url);
      const targetUrl = url.parse(target);
      const targetA =
        'ws://' + targetUrl.host + (targetUrl.port ? targetUrl.port : '');
      console.log('proxy: ws target: ', targetA);
      this.proxy.ws(req, socket, head, {
        target: targetA,
        ws: true,
        changeOrigin: true,
        hostRewrite: true,
        autoRewrite: true,
        protocolRewrite: true,
        followRedirects: true
      });
    });

    this.server.on('error', err => {
      console.warn('proxy: server error', err);
    });

    console.log(`proxy: listening on port ${this.port}`);
    this.server.listen(this.port, () => {
      this.webSocketServer = io.listen(this.server);
    });
  }

  isHostSupportZone(host: string): boolean {
    const result = this.zones.find(zone => host.endsWith(zone));
    return !!result ? true : false;
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
      (!!targetURL.protocol ? targetURL.protocol + '//'  : '') +
      targetHost +
      (!!targetURL.port ? ':' + targetURL.port : '');
    console.log(`proxy: target - ${target}`);
    return target;
  }

  private async startProxy() {
    const options = {
      // target: {
      //   host: '127.0.0.1',
      //   port: 5050
      // },
      // target: {
      //   protocol: 'ws:',
      //   host: 'localhost',
      //   port: 5050
      // },
      // target: 'ws://127.0.0.1:5050',
      secure: false,
      autoRewrite: true,
      changeOrigin: true,
      hostRewrite: true,
      protocolRewrite: true,
      followRedirects: true,
      ws: true
    };

    this.proxy = httpProxy.createProxyServer(options);

    // this.proxy.on('upgrade', async (req, socket, head) => {
    //   console.log('httpProxy: connection upgrade to ws: ', req.url);
    //   console.log('httpProxy http headers: ', req.headers);
    //   const target = await this.getTarget(req.headers.host + req.url);
    //   const targetUrl = url.parse(target);
    //   const targetA =
    //     'ws://' + targetUrl.host + (targetUrl.port ? targetUrl.port : '');
    //   console.log('httpProxy: ws target: ', targetA);
    //   this.proxy.ws(req, socket, head, {
    //     target: targetA,
    //     ws: true,
    //     changeOrigin: true,
    //     hostRewrite: true,
    //     autoRewrite: true,
    //     protocolRewrite: true,
    //     followRedirects: true
    //   });
    // });

    this.proxy.listen(6060);
  }

  private async requestDns(host: string): Promise<DnsAnswer> {
    return this.dnsService.request(host, RequestRecordType.AAAA, {
      connectionType: DomainNameServerConnection.UDP,
      // host: '303:8b1a::53',
      host: '202:6603:61f4:a421:a620:33b:d626:4efe',
      port: 5555
    });
  }
}
