import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {ServicioComponent} from './servicio/servicio.component';
import {ServicioService} from './servicio/servicio.service';
import {ServiciosComponent} from './servicios/servicios.component';
import {ServiciosService} from './servicios/servicios.service';
import {PenalidadComponent} from './penalidad/penalidad.component';
import {PenalidadService} from './penalidad/penalidad.service';
import {CoreModule} from '@core/core.module';
import {PenalidadesComponent} from './penalidades/penalidades.component';
import {HabitacionesComponent} from './habitaciones/habitaciones.component';
import {HabitacionesService} from './habitaciones/habitaciones.service';
import {HabitacionComponent} from './habitacion/habitacion.component';
import {HabitacionService} from './habitacion/habitacion.service';
import {PenalidadesService} from './penalidades/penalidades.service';
import {HotelComponent} from './hotel/hotel.component';
import {HotelService} from './hotel/hotel.service';
import {HotelesComponent} from './hoteles/hoteles.component';
import {HotelesService} from './hoteles/hoteles.service';
import {CountriesService} from '@service/countries.service';
import {ProveedorComponent} from './proveedor/proveedor.component';
import {ProveedorService} from './proveedor/proveedor.service';
import {ProveedoresComponent} from './proveedores/proveedores.component';
import {ProveedoresService} from './proveedores/proveedores.service';
import {OportunidadesService} from './oportunidades/oportunidades.service';
import { CotizacionComponent } from './cotizacion/cotizacion.component';
import {CotizacionService} from './cotizacion/cotizacion.service';


const routes: Routes = [

    {
        path     : 'servicios',
        component: ServiciosComponent,
        resolve  : {
            data: ServiciosService
        }
    },
    {
        path     : 'servicio',
        component: ServicioComponent,
        resolve  : {
            data: ServicioService
        }
    },
    {
        path     : 'servicio/:id',
        component: ServicioComponent,
        resolve  : {
            data: ServicioService
        }
    },


    {
        path     : 'habitaciones',
        component: HabitacionesComponent,
        resolve  : {
            data: HabitacionesService
        }
    },
    {
        path     : 'habitacion',
        component: HabitacionComponent,
        resolve  : {
            data: HabitacionService
        }
    },
    {
        path     : 'habitacion/:id',
        component: HabitacionComponent,
        resolve  : {
            data: HabitacionService
        }
    },
    {
        path     : 'penalidades',
        component: PenalidadesComponent,
        resolve  : {
            data: PenalidadesService
        }
    },
    {
        path     : 'penalidad',
        component: PenalidadComponent,
        resolve  : {
            data: PenalidadService
        }
    },
    {
        path     : 'penalidad/:id',
        component: PenalidadComponent,
        resolve  : {
            data: PenalidadService
        }
    },
    {
        path     : 'hoteles',
        component: HotelesComponent,
        resolve  : {
            data: HotelesService
        }
    },
    {
        path     : 'hotel',
        component: HotelComponent,
        resolve  : {
            data: HotelService
        }
    },
    {
        path     : 'hotel/:id',
        component: HotelComponent,
        resolve  : {
            data: HotelService
        }
    },
    {
        path     : 'proveedores',
        component: ProveedoresComponent,
        resolve  : {
            data: ProveedoresService
        }
    },
    {
        path     : 'proveedor/:id',
        component: ProveedorComponent,
        resolve  : {
            data: ProveedorService
        }
    },
    {
        path     : 'oportunidades',
        loadChildren: './oportunidades/oportunidades.module#OportunidadesModule',
    },
    {
        path     : 'cotizacion/:id/:status',
        component: CotizacionComponent,
        resolve  : {
            data: CotizacionService
        }
    },
];

@NgModule({
    declarations: [
        ServicioComponent,
        ServiciosComponent,
        HabitacionComponent,
        HabitacionesComponent,
        PenalidadComponent,
        PenalidadesComponent,
        HotelComponent,
        HotelesComponent,
        ProveedorComponent,
        ProveedoresComponent,
        CotizacionComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),
        CoreModule,
    ],
    providers   : [
        ServicioService,
        ServiciosService,
        HabitacionService,
        HabitacionesService,
        PenalidadService,
        PenalidadesService,
        HotelService,
        HotelesService,
        CountriesService,
        ProveedorService,
        ProveedoresService,
        OportunidadesService,
        CotizacionService
    ]
})
export class JumboModModule
{
}
