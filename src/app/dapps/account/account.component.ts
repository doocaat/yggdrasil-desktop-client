import { Component, OnInit, Inject } from '@angular/core';
import { DappsService } from '../dapps.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  response = {};

  constructor(@Inject(DappsService) private dappsService: DappsService) {}

  ngOnInit() {}

  async createAccount() {
    const service = await (await this.dappsService.getClient()).service(
      'vaccounts',
      'eosio'
    );

    this.response = await service.push_liquid_account_transaction(
      'eosio',
     // '5K1X322rLoG1QR2XXbjgGAbvTCBJ9MbXL9HZnKR1jNNUCqPNZN2',
    //  '5JMUyaQ4qw6Zt816B1kWJjgRA5cdEE6PhCb2BW45rU8GBEDa1RC',
      '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
      'regaccount',
      {
        vaccount: 'testing126' // increment to new account if fails
      }
    );
  }
}
