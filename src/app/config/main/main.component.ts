import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  peerAddressList = [];
  configPathList = [];

  constructor(public configService: ConfigService) { }

  ngOnInit() {
    this.configService.loadConfig();
  }

}
