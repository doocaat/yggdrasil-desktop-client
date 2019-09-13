import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services';
import { from } from 'rxjs';
import { ConfigService } from '../config/config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public yggdrasilConfig: any;

  constructor(public configService: ConfigService) { }

  ngOnInit() {
   this.configService.loadYggdrasilConfig();
  }
}
