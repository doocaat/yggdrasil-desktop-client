import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { MainComponent } from './main/main.component';



@NgModule({
  declarations: [SettingsComponent, MainComponent],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    RouterModule.forChild([
      {
        path: 'settings',
        component: SettingsComponent,
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
        ]}
    ])
  ]
})
export class SettingsModule { }
