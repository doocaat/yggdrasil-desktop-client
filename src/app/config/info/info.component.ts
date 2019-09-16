import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  constructor(public configService: ConfigService) { }

  ngOnInit() {
    // this.configService.loadYggdrasilConfig();
  }

}
