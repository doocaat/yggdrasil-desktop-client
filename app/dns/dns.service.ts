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

  private server;

  async request(
    domain: string,
    recordType: RequestRecordType,
    server: DomainNameServer
  ): Promise<DnsAnswer> {
    switch (server.connectionType) {
      case DomainNameServerConnection.DOH: {
        return this.doh(domain, recordType, server.host, server.port);
      }
      case DomainNameServerConnection.TLS: {
        return this.tls(domain, recordType, server.host, server.port);
      }
      case DomainNameServerConnection.TCP: {
        return this.tcp(domain, recordType, server.host, server.port);
      }
      case DomainNameServerConnection.UDP: {
        return this.udp(domain, recordType, server.host, server.port);
      }
    }
  }

  private async tls(
    domain: string,
    recordType: RequestRecordType,
    serverHost: string,
    serverPort: number
  ): Promise<DnsAnswer> {
    return new Promise<DnsAnswer>((resolve, reject) => {
      let response = null;
      let expectedLength = 0;
      const buf = dnsPacket.streamEncode({
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
      console.log(`dns: request tls - ${domain} ${recordType}`);
      const context = tls.createSecureContext({
        secureProtocol: 'TLSv1_2_method'
      });

      const options = {
        port: serverPort,
        host: serverHost,
        secureContext: context
      };

      const client = tls.connect(options, () => {
        console.log('dns: tls client connected');
        client.write(buf);
      });

      client.on('data', data => {
        console.log('dns: tls Received response: %d bytes', data.byteLength);
        if (response == null) {
          if (data.byteLength > 1) {
            const payloadLength = data.readUInt16BE(0);
            expectedLength = payloadLength;
            if (payloadLength < 12) {
              reject(new Error('below DNS minimum packet length'));
              throw new Error('below DNS minimum packet length');
            }
            response = Buffer.from(data);
          }
        } else {
          response = Buffer.concat([response, data]);
        }

        if (response.byteLength >= expectedLength) {
          const result = dnsPacket.streamDecode(response);
          console.log('dns: tls - resolve', result);
          if (!!result && result.rcode === 'NOERROR') {
            const answer = this.findBestAnswer(
              domain,
              result.answers as DnsAnswer[]
            );
            console.log('dns: udp result:', result);
            resolve(answer);
          } else {
            console.warn('dns: udp reject:', result);
            reject(result);
          }
          client.destroy();
        }
      });

      client.on('end', () => {
        console.log('dns: tls Connection ended');
      });
    });
  }

  private async doh(
    domain: string,
    recordType: RequestRecordType,
    serverHost: string,
    serverPort: number
  ): Promise<DnsAnswer> {
    return new Promise<DnsAnswer>((resolve, reject) => {
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
      console.log(`dns: request doh - ${domain} ${recordType}`);
      const options = {
        hostname: serverHost,
        port: serverPort,
        path: '/experimental',
        method: 'POST',
        headers: {
          'Content-Type': 'application/dns-udpwireformat',
          'Content-Length': Buffer.byteLength(buf)
        }
      };

      const request = https.request(options, response => {
        console.log('dns: doh statusCode:', response.statusCode);
        console.log('dns: doh headers:', response.headers);

        response.on('data', data => {
          const result = dnsPacket.decode(data);
          console.log('dns: doh response:', result);
          if (!!result && result.rcode === 'NOERROR') {
            const answer = this.findBestAnswer(
              domain,
              result.answers as DnsAnswer[]
            );
            console.log('dns: udp result:', result);
            resolve(answer);
          } else {
            console.warn('dns: udp reject:', result);
            reject(result);
          }
        });
      });

      request.on('error', e => {
        console.error(e);
        reject(e);
      });
      request.write(buf);
      request.end();
    });
  }

  private async tcp(
    domain: string,
    recordType: RequestRecordType,
    serverHost: string,
    serverPort: number
  ): Promise<DnsAnswer> {
    let response = null;
    let expectedLength = 0;
    return new Promise<DnsAnswer>((resolve, reject) => {
      const buf = dnsPacket.streamEncode({
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
      console.log(`dns: request tcp - ${domain} ${recordType}`);
      const client = new net.Socket();
      client.connect(serverPort, serverHost, () => {
        console.log('dns: tcp: connected');
        client.write(buf);
      });

      client.on('data', data => {
        console.log('dns: tcp: received response: %d bytes', data.byteLength);
        if (!response) {
          if (data.byteLength > 1) {
            const payloadLength = data.readUInt16BE(0);
            expectedLength = payloadLength;
            if (payloadLength < 12) {
              reject(new Error('below DNS minimum packet length'));
              throw new Error('below DNS minimum packet length');
            }
            response = Buffer.from(data);
          }
        } else {
          response = Buffer.concat([response, data]);
        }

        if (response.byteLength >= expectedLength) {
          const result = dnsPacket.decode(response);
          console.log('dns: tcp response:', result);
          if (!!result && result.rcode === 'NOERROR') {
            const answer = this.findBestAnswer(
              domain,
              result.answers as DnsAnswer[]
            );
            console.log('dns: udp result:', result);
            resolve(answer);
          } else {
            console.warn('dns: udp reject:', result);
            reject(result);
          }
          client.destroy();
        }
      });

      client.on('close', () => {
        console.log('dns: tcp: connection closed');
      });
    });
  }

  private async udp(
    domain: string,
    recordType: RequestRecordType,
    serverHost: string,
    serverPort: number
  ): Promise<DnsAnswer> {
    return new Promise<DnsAnswer>((resolve, reject) => {
      let socket = dgram.createSocket('udp4');

      if (IpUtil.isIpV6(serverHost)) {
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
          console.log('dns: udp result answer:', answer);
          resolve(answer);
        } else {
          console.warn('dns: udp reject:', result);
          reject(result);
        }
      });

      socket.send(buf, 0, buf.length, serverPort, serverHost);
    });
  }

  start() {
    this.server = dns.createServer({ dgram_type: 'udp6' });

    this.server.on('request', (request, response) => {
      console.log('dns: server request', request.question[0].name);
      if (request.question[0].name === 'mesh.ygg') {
        response.answer.push(dns.AAAA({
          name: request.question[0].name,
          address: '303:60d4:3d32:a2b9::4',
          ttl: 600,
        }));
      }

      if (request.question[0].name === 'map.ygg') {
        response.answer.push(dns.AAAA({
          name: request.question[0].name,
          address: '21f:dd73:7cdb:773b:a924:7ec0:800b:221e',
          ttl: 600,
        }));
      }

      if (request.question[0].name === 'yggedit.ygg') {
        response.answer.push(dns.AAAA({
          name: request.question[0].name,
          address: '301:b614:c68e:b27f::2',
          ttl: 600,
        }));
      }
      
      response.send();
    });

    this.server.on('error',  (err, buff, req, res) => {
      console.log(err.stack);
    });

    this.server.serve(5555);
    console.log('dns: server listening on port 5555');
  }

  getRandomInt(min: number = 1, max: number = 65534) {
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
