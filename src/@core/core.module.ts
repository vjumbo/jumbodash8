import { NgModule } from '@angular/core';
import {MatCoreModule} from '@core/mat.core/mat.core.module';
import {FuseSharedModule} from '@fuse/shared.module';
import {FuseWidgetModule} from '@fuse/components';

@NgModule({
  exports: [
      MatCoreModule,
      FuseSharedModule,
      FuseWidgetModule
  ],
})
export class CoreModule { }
