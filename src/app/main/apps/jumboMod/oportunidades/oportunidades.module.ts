import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import {OportunidadesComponent} from './oportunidades.component';
import {OportunidadesService} from './oportunidades.service';
import {OportunidadModelsOportunidadModelFormDialogComponent} from './oportunidad-form/oportunidad-form.component';
import {OportunidadListComponent} from './oportunidad-list/oportunidad-list.component';
import {OportunidadSelectedBarComponent} from './selected-bar/selected-bar.component';
import {OportunidadesMainSidebarComponent} from './sidebars/main/main.component';


const routes: Routes = [
    {
        path     : '**',
        component: OportunidadesComponent,
        resolve  : {
            entidades: OportunidadesService
        }
    }
];

@NgModule({
    declarations   : [
        OportunidadesComponent,
        OportunidadListComponent,
        OportunidadSelectedBarComponent,
        OportunidadesMainSidebarComponent,
        OportunidadModelsOportunidadModelFormDialogComponent,
    ],
    imports        : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatTableModule,
        MatToolbarModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
    ],
    providers      : [
        OportunidadesService
    ],
    entryComponents: [
        OportunidadModelsOportunidadModelFormDialogComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OportunidadesModule
{
}
