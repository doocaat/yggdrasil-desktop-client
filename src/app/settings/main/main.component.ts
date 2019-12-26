import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../config/config.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  config: any = null;

  constructor(public configService: ConfigService) { }

  ngOnInit() {

    this.configService.configApp.subscribe(config => {
      this.config = config;
    });

    this.configService.loadConfig();
  }

}
