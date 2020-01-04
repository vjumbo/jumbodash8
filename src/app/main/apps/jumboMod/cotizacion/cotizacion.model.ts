import { Vuelos, Sistema } from '@configs/interfaces';

export class CotizacionModel {
    _id: string;
    idQuote: string;
    crmPotential: {};
    status: string;
    fechaElaboracion: Date;
    oficina: string;
    telefono: string;
    emailAsesor: string;
    cliente: any;
    nombreCliente: string;
    telefonoCliente: string;
    emailCliente: string;
    autorizaPublicidad = false;
    cirugia = false;
    embarazo = false;
    destino: string;
    tipoCotizacion: string;
    hoteles: [{
        hotel: {}
        habitacion: [{}]

    }];
    planIncluye: string;
    planNoIncluye: string;
    chd: number;
    chdValor: number;
    chdValorTotal: number;
    adult: number;
    adultValor: number;
    adultValorTotal: number;
    vuelos: [Vuelos];
    horaSalida: string;
    horaSalidaPresentarseAeropuerto: string;
    horaRetorno: string;
    horaRetornoPresentarseAeropuerto: string;
    tipoTarifa: string;
    reembolsable: {type: boolean, default: false};
    cambioNombre: string;
    sistema: Sistema;

    constructor(entidad?) {

    }

}
