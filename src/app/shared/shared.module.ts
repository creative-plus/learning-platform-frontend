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
import { CourseListComponent } from './course-list/course-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { CourseViewerComponent } from './course-viewer/course-viewer.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MatTableModule } from '@angular/material/table';
import { OrdinalPipe } from './pipes/ordinal.pipe';


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
  MatListModule,
  MatSelectModule,
  MatCheckboxModule,
  MatRadioModule,
  MatDialogModule,
  MatTableModule,
]

@NgModule({
  declarations: [
    LoadingComponent,
    CourseListComponent,
    CourseViewerComponent,
    LeaderboardComponent,
    OrdinalPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    ...materialDeps,
  ],
  exports: [
    ...materialDeps,
    LoadingComponent,
    CourseListComponent,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    CourseViewerComponent,
    LeaderboardComponent,
    OrdinalPipe,
  ]
})
export class SharedModule { }
