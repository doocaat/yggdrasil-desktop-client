import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ConfigComponent } from './config.component';
import { PeersComponent } from './peers/peers.component';
import { InfoComponent } from './info/info.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: 'config',
    component: ConfigComponent,
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        component: MainComponent
      },
      {
        path: 'info',
        component: InfoComponent
      },
      {
        path: 'peers',
        component: PeersComponent
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule {}
