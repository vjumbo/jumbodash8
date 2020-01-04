import { FuseNavigation } from '@fuse/types';
import {ServicioConst} from '../main/apps/jumboMod/servicio/servicio.model';
import {HabitacionConst} from '../main/apps/jumboMod/habitacion/habitacion.model';
import {PenalidadConst} from '../main/apps/jumboMod/penalidad/penalidad.model';
import {HotelConst} from '../main/apps/jumboMod/hotel/hotel.model';
import {ProveedorConst} from '../main/apps/jumboMod/proveedor/proveedor.model';
import {OportunidadesConst} from '../main/apps/jumboMod/oportunidades/oportunidad.model';

export const navigation: FuseNavigation[] = [
    {
        id       : 'settings',
        title    : 'Configuraciones',
        translate: 'NAV.SETTINGS',
        type     : 'group',
        icon     : 'apps',
        children : [
            {
                id       : 'hoteles',
                title    : 'Hoteles',
                translate: 'NAV.HOTELES',
                type     : 'collapsable',
                icon     : 'border_all',
                children : [
                    {
                        id       : 'servicios',
                        title    : ServicioConst.names,
                        // translate: 'NAV.SERVICES.TITLE',
                        type     : 'item',
                        icon     : ServicioConst.icon,
                        url  : ServicioConst.urlEntidades
                    },
                    {
                        id       : 'habitaciones',
                        title    : HabitacionConst.names,
                        // 'translate': 'NAV.SERVICES.TITLE',
                        type     : 'item',
                        icon     : HabitacionConst.icon,
                        url  : HabitacionConst.urlEntidades
                    },
                    {
                        id       : 'penalidades',
                        title    : PenalidadConst.names,
                        // 'translate': 'NAV.SERVICES.TITLE',
                        type     : 'item',
                        icon     : PenalidadConst.icon,
                        url  : PenalidadConst.urlEntidades
                    },
                    {
                        id       : 'hoteles',
                        title    : HotelConst.names,
                        // 'translate': 'NAV.SERVICES.TITLE',
                        type     : 'item',
                        icon     : HotelConst.icon,
                        url  : HotelConst.urlEntidades
                    }
                ]
            },
        ]
    },
    {
        id       : 'applications',
        title    : 'Aplicaciones',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'proveedores',
                title    : ProveedorConst.names,
                translate: 'NAV.POTENTIALS.TITLE',
                type     : 'item',
                icon     : ProveedorConst.icon,
                url      : ProveedorConst.urlEntidades,
            },
            {
                id       : 'oportunidades',
                title    : OportunidadesConst.names,
                translate: 'NAV.POTENTIALS.TITLE',
                type     : 'item',
                icon     : OportunidadesConst.icon,
                url      : OportunidadesConst.urlEntidades,
            },
            /*{
                id       : 'oportunidades',
                title    : 'Oportunidades',
                translate: 'NAV.POTENTIALS.TITLE',
                type     : 'item',
                icon     : 'email',
                url      : '/apps/Oportunidades',
            },
            {
                id       : 'quote',
                title    : 'Cotizacion',
                translate: 'NAV.QUOTE.TITLE',
                type     : 'item',
                icon     : 'email',
                url      : '/apps/Oportunidades',
            },
            {
                id       : 'p2',
                title    : 'Page2',
                translate: 'NAV.PAGE2.TITLE',
                type     : 'item',
                icon     : 'email',
                url      : '/PAGE2',
                badge    : {
                    title    : '25',
                    translate: 'NAV.PAGE2.BADGE',
                    bg       : '#1d22f4',
                    fg       : '#FFFFFF'
                }
            },
            {
                id       : 'p3',
                title    : 'Page3',
                translate: 'NAV.PAGE3.TITLE',
                type     : 'item',
                icon     : 'email',
                url      : '/PAGE3',
                badge    : {
                    title    : '25',
                    translate: 'NAV.PAGE3.BADGE',
                    bg       : '#6cf442',
                    fg       : '#ff5246'
                }
            }*/
        ]
    }
];
