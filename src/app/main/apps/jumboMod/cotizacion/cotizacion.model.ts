import {Vuelos, Sistema, Cotizacion, HotelesDoc, Hotel, FileSys, HabHotelDoc} from '@configs/interfaces';

export class CotizacionModel implements Cotizacion{
    _id: string;
    idQuote: number;
    crmPotential: any;
    status: string;
    fechaElaboracion: Date;
    asesor: string;
    oficina: string;
    telefono: string;
    emailAsesor: string;
    cliente: any;
    nombreCliente: string;
    telefonoCliente: string;
    emailCliente: string;
    autorizaPublicidad = true;
    cirugia = false;
    embarazo = false;
    otro: string;
    destino: string;
    tipoCotizacion: string;
    hoteles: HotelesDoc[];
    totalHoteles: number;
    planIncluye: string;
    planNoIncluye: string;
    totalMomenda: any;
    chd: number;
    chdValor: number;
    chdValorTotal: number;
    adult: number;
    adultValor: number;
    adultValorTotal: number;
    inf: number;
    infValor: number;
    infValorTotal: number;
    vuelos: Vuelos[];
    horaSalida: string;
    horaSalidaPresentarseAeropuerto: string;
    horaRetorno: string;
    horaRetornoPresentarseAeropuerto: string;
    tipoTarifa: string;
    reembolsable = false;
    cambioNombre: string;
    sistema: Sistema;

    constructor(entidad, status: string, oportunidad: any , cliente: any) {
        entidad = entidad || {};
        this._id = entidad._id || null;
        this.idQuote = entidad.idQuote || null;
        this.crmPotential = entidad.crmPotential || oportunidad;
        this.status = entidad.status || status;
        this.fechaElaboracion = entidad.fechaElaboracion || new Date();
        this.asesor = entidad.asesor || null;
        this.oficina = entidad.oficina || null;
        this.telefono = entidad.telefono || null;
        this.emailAsesor = entidad.emailAsesor || null;
        this.cliente = entidad.cliente || cliente;
        this.nombreCliente = entidad.nombreCliente || null;
        this.telefonoCliente = entidad.telefonoCliente || null;
        this.emailCliente = entidad.emailCliente || null;
        this.autorizaPublicidad = entidad.autorizaPublicidad || true;
        this.cirugia = entidad.cirugia || false;
        this.embarazo = entidad.embarazo || false;
        this.otro = entidad.otro || null;
        this.destino = entidad.destino || null;
        this.tipoCotizacion = entidad.tipoCotizacion || null;
        this.hoteles = entidad.hoteles || [];
        this.totalHoteles = entidad.totalHoteles || null;
        this.planIncluye = entidad.planIncluye || null;
        this.planNoIncluye = entidad.planNoIncluye || null;
        this.totalMomenda = entidad.totalMoneda || null;
        this.chd = entidad.chd || null;
        this.chdValor = entidad.chdValor || null;
        this.chdValorTotal = entidad.chdValorTotal || null;
        this.adult = entidad.adult || null;
        this.adultValor = entidad.adultValor || null;
        this.adultValorTotal = entidad.adultValorTotal || null;
        this.inf = entidad.inf || null;
        this.infValor = entidad.infValor || null;
        this.infValorTotal = entidad.infValorTotal || null;
        this.vuelos = entidad.vuelos || [];
        this.horaSalida = entidad.horaSalida || null;
        this.horaSalidaPresentarseAeropuerto = entidad.horaSalidaPresentarseAeropuerto || null;
        this.horaRetorno = entidad.horaRetorno || null;
        this.horaRetornoPresentarseAeropuerto = entidad.horaRetornoPresentarseAeropuerto || null;
        this.tipoTarifa = entidad.tipoTarifa || null;
        this.reembolsable = entidad.reembolsable || null;
        this.cambioNombre = entidad.cambioNombre || null;
        this.sistema = entidad.sistema || {};
    }

}

export class CotizacionesModel {
    status: string;
    oportunidad: any;
    cliente: any;
    Cotizado: Cotizacion;
    Aceptado: Cotizacion;
    Finalizado: Cotizacion;

    constructor(cotizaciones: any[], status: string, oportunidad: any, cliente: any) {
        this.setStatus(status);
        this.setOportunidad(oportunidad);
        this.setCliente(cliente);
        this.iniCotizaciones(cotizaciones);
        this.iniNew(cotizaciones);
    }

    private iniCotizaciones(cotizaciones: any[]): void {
        if (cotizaciones !== null && cotizaciones.length > 0) {
            this.Cotizado = new CotizacionModel(
                cotizaciones.find(c => c.status === 'Cotizado'),
                this.status, this.oportunidad,
                this.cliente
            );
            this.Aceptado = new CotizacionModel(
                cotizaciones.find(c => c.status === 'Aceptado'),
                this.status,
                this.oportunidad,
                this.cliente
            );
            this.Finalizado = new CotizacionModel(
                cotizaciones.find(c => c.status === 'Finalizado'),
                this.status,
                this.oportunidad,
                this.cliente
            );
        }
    }

    private iniNew(cotizaciones: any[]): void {
       switch (this.status) {
           case 'Cotizado' :
                if (!this.Cotizado) {
                    this.Cotizado = new CotizacionModel(
                        null,
                        this.status,
                        this.oportunidad,
                        this.cliente
                    );
                }
                break;
           case 'Aceptado':
               if (!this.Aceptado) {
                   this.Aceptado = new CotizacionModel(
                       null,
                       this.status,
                       this.oportunidad,
                       this.cliente
                   );
               }
               break;
           case 'Finalizado':
               if (!this.Finalizado) {
                   this.Finalizado = new CotizacionModel(
                       null,
                       this.status,
                       this.oportunidad,
                       this.cliente
                   );
               }
               break;
       }
    }

    setOportunidad(oportunidad: any): void {
        this.oportunidad = oportunidad;
    }

    setStatus(status: string): void {
        this.status = status;
    }

    setCliente(cliente: any): void {
        this.cliente = cliente;
    }

    getActualDoc(): Cotizacion {
        switch (this.status) {
            case 'Cotizado' :
                return this.Cotizado;
            case 'Aceptado':
                return this.Aceptado;
            case 'Finalizado':
                return this.Finalizado;
        }
    }

    transferCotizacion(): void {}

}

export class HotelDoc implements HotelesDoc{
    idHotel: string;
    categoria: string;
    descripcion: string;
    fechaIn: Date;
    fechaOut: Date;
    habitaciones: HabHotelDoc[];
    hotel: any;
    totalHotel: number;
    img: FileSys[];
    noServicios: any[];
    nombre: string;
    penalidades: any[];
    servicios: any[];
    tipoAlimentacion: any[];

    constructor(hotel: Hotel) {
        this.idHotel = hotel._id;
        this.categoria = hotel.categoria;
        this.descripcion = hotel.descripcion;
        this.fechaIn = null;
        this.fechaOut = null;
        this.habitaciones = [];
        this.hotel = hotel;
        this.totalHotel = 0;
        this.img = hotel.imagenes;
        this.noServicios = hotel.serviciosNoIncluidos;
        this.nombre = hotel.nombre;
        this.penalidades = hotel.penalidades;
        this.servicios = hotel.servicios;
        this.tipoAlimentacion = hotel.regimenAlimentacion;
    }
}
