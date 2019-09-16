import { Component, OnInit } from '@angular/core';
import { ConfigService } from './config.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  constructor(public configService: ConfigService) { }

  ngOnInit() {
   // this.configService.loadYggdrasilConfig();
  }

}
