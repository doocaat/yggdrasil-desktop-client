import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PrettySizeModule} from 'angular-pretty-size';
import {
  MatDividerModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatOptionModule,
  MatSelectModule,
  MatInputModule,
  MatExpansionModule,
  MatDialogModule,
  MatTooltipModule,
  MatCardModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatButtonToggleModule,
} from '@angular/material';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DurationPipe } from './pipes/moment/duration.pipe';
import { RoundPipe } from './pipes/number/round.pipe';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, DurationPipe, RoundPipe],
  imports: [
    CommonModule,
    TranslateModule,
    MatDividerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    // @ts-ignore
    PrettySizeModule,
  ],
  exports: [
    TranslateModule,
    WebviewDirective,
    MatDividerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatCardModule,
    FormsModule,
    // @ts-ignore
    PrettySizeModule,
    DurationPipe,
    RoundPipe
  ]
})
export class SharedModule {}
