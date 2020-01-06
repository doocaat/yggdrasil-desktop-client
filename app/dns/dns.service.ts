import { provide } from 'inversify-binding-decorators';
import * as dnsPacket from 'dns-packet';
import * as dgram from 'dgram';
import * as net from 'net';
import * as https from 'https';
import * as tls from 'tls';
import * as dns from 'native-dns';
import { IpUtil } from '../proxy/ip.util';
import {
  DomainNameServer,
  DomainNameServerConnection,
  RequestRecordType,
  DnsAnswer
} from '../proxy/types';

@provide(DnsService)
export class DnsService {

  async request(
    domain: string,
    recordType: RequestRecordType,
    server: DomainNameServer
  ): Promise<DnsAnswer> {
      return new Promise<DnsAnswer>((resolve, reject) => {
        let socket = dgram.createSocket('udp4');

        if (IpUtil.isIpV6(server.host)) {
          socket = dgram.createSocket('udp6');
        }

        console.log(`dns: request udp - ${domain} ${recordType}`);
        const buf = dnsPacket.encode({
          type: 'query',
          id: this.getRandomInt(),
          flags: dnsPacket.RECURSION_DESIRED,
          questions: [
            {
              type: recordType,
              name: domain
            }
          ]
        });

        socket.on('message', message => {
          const result = dnsPacket.decode(message);
          console.log('dns: udp response'); // prints out a response from google dns
          if (!!result && result.rcode === 'NOERROR') {
            const answer = this.findBestAnswer(
              domain,
              result.answers as DnsAnswer[]
            );
            console.log('dns: result answer:', answer);
            resolve(answer);
          } else {
            console.warn('dns: reject:', result);
            reject(result);
          }
        });

        socket.send(buf, 0, buf.length, server.port, server.host);
      });
  }

  private getRandomInt(min: number = 1, max: number = 65534) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private findBestAnswer(host: string, answers: DnsAnswer[]): DnsAnswer {
    const sortedAnswers = answers.sort((a, b) => a.ttl - b.ttl);

    const finder = (hostForFind, answersList: DnsAnswer[]) => {
      const answer = answersList.find(item => item.name === hostForFind);

      if (!!answer && answer.type === RequestRecordType.CNAME) {
        return finder(answer.data, answersList);
      }
      return answer;
    };

    return finder(host, sortedAnswers);
  }
}
