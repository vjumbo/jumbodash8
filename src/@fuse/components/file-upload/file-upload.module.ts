import { NgModule } from '@angular/core';
import {MaterialFileUploadComponent} from '@fuse/components';
import {MatCoreModule} from '@core/mat.core/mat.core.module';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
    declarations: [
        MaterialFileUploadComponent,
    ],
    imports: [
        MatCoreModule,
        FormsModule,
        CommonModule,
    ],
    exports: [
        MaterialFileUploadComponent
    ],
})
export class FileUploadModule
{
}
