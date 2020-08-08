import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountModule } from './account/account.module';
import { DAppsComponent } from './dapps.component';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  {
    path: 'dapps',
    component: DAppsComponent,
    children: [
      {
        path: '',
        redirectTo: 'account',
        pathMatch: 'full'
      },
      {
        path: 'account',
        component: AccountComponent
      },
    ]
  }
];

@NgModule({
  declarations: [DAppsComponent],
  imports: [
    CommonModule,
    AccountModule,
    RouterModule.forChild(routes)
  ]
})
export class DAppsModule { }
