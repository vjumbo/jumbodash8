import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {CoreModule} from '@core/core.module';

const routes = [
    {
        path        : 'home',
        loadChildren: './sample/sample.module#SampleModule'
    },
    /*{
        path        : 'Oportunidades',
        loadChildren: './potentials/potentials.module#PotentialsModule'
    },*/
    {
        path        : 'jumbomod',
        loadChildren: './jumboMod/jumboMod.module#JumboModModule'
    },
];

@NgModule({
    imports     : [
        RouterModule.forChild(routes),
        CoreModule,
    ]
})
export class AppsModule
{
}
