import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoadingComponent } from './loading/loading.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from "@angular/material/list";


const materialDeps = [
  MatButtonModule,
  MatCardModule,
  MatSnackBarModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatToolbarModule,
  MatTooltipModule,
  MatSidenavModule,
  MatMenuModule,
  MatListModule
]

@NgModule({
  declarations: [
    LoadingComponent
  ],
  imports: [
    CommonModule,
    ...materialDeps,
  ],
  exports: [
    ...materialDeps,
    LoadingComponent,
  ]
})
export class SharedModule { }
