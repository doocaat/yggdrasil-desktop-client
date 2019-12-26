import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigComponent } from './config.component';
import { ConfigRoutingModule } from './config-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { PeersComponent } from './peers/peers.component';
import { InfoComponent } from './info/info.component';
import { PeerFormComponent } from './peers/peer-form/peer-form.component';
import { MainComponent } from './main/main.component';



@NgModule({
  declarations: [ConfigComponent, PeersComponent, InfoComponent, PeerFormComponent, MainComponent],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    SharedModule,
    CoreModule
  ],
  entryComponents: [
    PeerFormComponent
  ]
})
export class ConfigModule { }
