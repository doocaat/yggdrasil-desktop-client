import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit {

  constructor(private electronService: ElectronService) { }

  ngOnInit() {
  }

  runApplication(application: string) {
    this.electronService.ipcRenderer.send(application);
  }
}
