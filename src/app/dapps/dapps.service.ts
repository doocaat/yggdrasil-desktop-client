import { Injectable } from '@angular/core';
import { createClient } from '@liquidapps/dapp-client';

@Injectable({
  providedIn: 'root'
})
export class DappsService {
  constructor() {}

  async getClient() {
    return await createClient({
      network: 'development',
      httpEndpoint:
        'https://8888-a17b3ab7-9a8f-420d-8194-ad9c7b5a7d40.ws-eu01.gitpod.io',
      fetch: window.fetch.bind(window)
    });
  }
}
