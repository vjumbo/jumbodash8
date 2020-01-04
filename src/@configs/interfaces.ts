export interface WidthHeightMed {
    width?: number;
    height?: number;
    Media?: number;
}

export interface Sistema {
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreador: number | any;
    usuarioAsignado: number | any;
}

export interface Rol {
    id: number;
    name: string;
    descripcion: string;
    permisos: any[];
    sistema: Sistema;
}

export interface Usuario {
    id?: number;
    username: string;
    apikey: string;
    crmid: string;
    userInfo: any;
    rol?: Rol;
    sistema: Sistema;
}

export interface Moneda {
    _id?: string;
    id: number;
    currency_name: string;
    currency_code: string;
    currency_symbol: string;
    defaultid: number;
    relacionPrincipal: number;
    conversion_rate: number;
}

export interface Servicio {
    _id?: string;
    nombre: string;
    descripcion: string;
    costo: number;
    moneda?: Moneda;
    sistema?: Sistema;
}

export interface FechasPenalidad {
    fechasini: Date;
    fechaFin: Date;
}

export interface Penalidad {
    _id?: string;
    nombre: string;
    fechas?: FechasPenalidad[];
    cancelacionesDias: number;
    cargo: string;
    descripcion: string;
    sistema?: Sistema;
}

export interface Docs {
    _id: number;
}

export interface Habitacion {
  _id?: string;
  nombre: string;
  descripcion: string;
  capacidad: number;
  adulto: number;
  ninos: number;
  inf: number;
  tipoCama: string;
  sistema?: Sistema;
}

export interface TarjetaCredito {
    disponible: boolean;
    porcentaje: number;
}

export interface Transferencia {
    disponible: boolean;
    costoTransferencia: number;
    moneda: Moneda;
}

export interface Efectivo {
    disponible: boolean;
}

export interface FormaPago {
    tarjetaCredito: TarjetaCredito;
    transferencia: Transferencia;
    efectivo: Efectivo;
}

export interface CuentaBancariaSchema {
    razonSocial: string;
    pais: string;
    nombreBeneficiario: string;
    nombreBancoBeneficiario: string;
    numeroCuenta: string;
    tipoCuenta: string;
    aba: string;
    swift: string;
    bancoIntermediario: string;
    cuentaIntermediaria: string;
    formaPago: FormaPago;
    descripcion: string;
}

export type HotelType = 'Adulto' | 'Familias' | 'LGTB';
export type TipoTarifaType = 'Habitacion' | 'Personas';

export interface Hotel {
    _id?: string;
    nombre: string;
    segmeto: HotelType;
    categoria: string;
    habitaciones?: Habitacion[];
    servicios?: Servicio[];
    serviciosNoIncluidos?: Servicio[];
    penalidades?: Penalidad[];
    region: string;
    regimenAlimentacion?: [
        {
            nombreRegimen: string;
            descripcion: string
        }
        ];
    tipoPlan?: [{
        nombrePlna: string;
        descripcion: string
    }];
    tipoTarifa?: [{
        tipoHabitacion: Habitacion;
        numPersonas: number;
        tipo: TipoTarifaType;
        monto: number
    }];
    email?: {
        pagos?: string;
        reservas?: string;
        jefeReservas?: string;
    };
    telefonos?: {
        pagos?: string;
        reservas?: string;
        jefeReservas?: string;
    };
    ejecutivoVentas?: {
        nombre: string;
        telefono: string;
        email: string;
    };
    cuentaBancaria?: CuentaBancariaSchema;
    contrato: FileSys;
    cargoPromociones: FileSys;
    imagenes: FileSys[];
    descripcion: string;
    sistema: Sistema;
}

export interface FileSys {
    name: string;
    type: string;
    data: string;
}

export interface ProveedorCrmInfo {
    id: string;
    crmInfo: any;
    proveedor: Proveedor;
}

export interface  Proveedor {
    _id?: string;
    crmid: string;
    crmInfo: any;
    nombre: string;
    hoteles: Hotel[];
    email: string;
    telefono: string;
    cuentaBancaria?: CuentaBancariaSchema;
    contrato: FileSys;
    cargoPromociones: FileSys;
    descripcion: string;
    sistema: Sistema;
}


export interface Vuelos {
    _id?: string;
    crmid: string;
    aerolinea: string;
    vuelo: string;
    fecha: string;
    origen: string;
    destino: string;
    sale: string;
    llega: string;
    numeroBoleto: string;
}

export interface Cotizacion {
    _id?: string;
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
    autorizaPublicidad: boolean;
    cirugia: boolean;
    embarazo: boolean;
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
}
