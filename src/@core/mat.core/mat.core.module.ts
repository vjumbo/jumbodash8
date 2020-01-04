import { NgModule } from '@angular/core';
import {
    MatAutocompleteModule,
    MatButtonModule, MatCardModule,
    MatChipsModule, MatDatepickerModule, MatFormFieldModule,
    MatIconModule,
    MatInputModule, MatMenuModule,
    MatPaginatorModule, MatProgressBarModule,
    MatRippleModule,
    MatSelectModule, MatSidenavModule, MatSnackBarModule,
    MatSortModule, MatTableModule,
    MatTabsModule, MatToolbarModule
} from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMomentDateModule} from '@angular/material-moment-adapter';

@NgModule({
  exports: [
      // Material moment date module
      MatMomentDateModule,
      MatAutocompleteModule,
      // Material
      MatButtonModule,
      MatIconModule,
      MatCheckboxModule,
      MatChipsModule,
      MatFormFieldModule,
      MatInputModule,
      MatPaginatorModule,
      MatRippleModule,
      MatSelectModule,
      MatSortModule,
      MatSnackBarModule,
      MatTableModule,
      MatTabsModule,
      MatCardModule,
      MatMenuModule,
      MatToolbarModule,
      MatSidenavModule,
      MatDatepickerModule,
      MatIconModule,
      MatProgressBarModule,
  ]
})
export class MatCoreModule { }
