import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import {CoreModule} from '@core/core.module';
import {VtLoginComponent} from './vt-login.component';

const routes = [
    {
        path     : 'auth/jumbologin',
        component: VtLoginComponent
    }
];

@NgModule({
    declarations: [
        VtLoginComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        CoreModule,
    ]
})
export class VtLoginModule
{
}
