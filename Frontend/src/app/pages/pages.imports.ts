// pages/pages.imports.ts
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { NoEmojiDirective } from '../core/directives/no-emoji';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';

export const PAGES_IMPORTS = [
  CommonModule,
  FormsModule,
  HttpClientModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatChipsModule,
  MatIconModule,
  NoEmojiDirective,
  MatDialogModule,
  MatListModule,
  FormsModule,
  MatCheckboxModule,
  MatInputModule,
  DragDropModule,
  ReactiveFormsModule,
  MatSelectModule,
  MatTableModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatMenuModule
];