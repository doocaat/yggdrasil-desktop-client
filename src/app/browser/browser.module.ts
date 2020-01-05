import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserComponent } from './browser.component';
import { WebComponent } from './web/web.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: 'browser',
    component: BrowserComponent,
    children: [
      {
        path: '',
        redirectTo: 'web',
        pathMatch: 'full'
      },
      {
        path: 'web',
        component: WebComponent
      },
    ]
  }
];

@NgModule({
  declarations: [BrowserComponent, WebComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class BrowserModule { }
