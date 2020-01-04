import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import {MatSnackBar} from '@angular/material';
import {Observable, Subject} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import {HotelConst, HotelModel} from './hotel.model';
import {HotelService} from './hotel.service';
import {Router} from '@angular/router';
import {Utilities} from '@utilities/utilities';
import {CountriesService} from '@service/countries.service';
import {FileSys, Habitacion, Moneda, Penalidad, Servicio} from '@configs/interfaces';
import {FuseProgressBarService} from '@fuse/components/progress-bar/progress-bar.service';

export interface RegionGroup {
    type: string;
    options: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
    const filterValue = value.toLowerCase();

    return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
    selector     : 'jum-hotel',
    templateUrl  : './hotel.component.html',
    styleUrls    : ['./hotel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class HotelComponent implements OnInit, OnDestroy
{
    entidad: HotelModel;
    pageType: string;
    entidadForm: FormGroup;
    habitacionesForm: FormGroup;
    serviciosForm: FormGroup;
    noServiciosForm: FormGroup;
    penalidadesForm: FormGroup;
    imagesForm: FormGroup;
    entidadConst: any;
    countries: any[];
    regions: string[];
    hotelTypes: string[];
    tipoTarifaTypes: string[];
    habitaciones: Habitacion[];
    servicios: Servicio[];
    penalidades: Penalidad[];
    // Private
    private _unsubscribeAll: Subject<any>;

    regimenAlimentacion: FormArray;
    tipoPlan: FormArray;
    tipoTarifa: FormArray;
    monedas: Moneda[];
    regionGroups: RegionGroup[];
    regionGroupOptions: Observable<RegionGroup[]>;
    paisfilteredOptions: Observable<string[]>;

    hasFileCp = false;
    hasFileCon = false;

    filteredHabOptions: Observable<string[]>;
    filteredServOptions: Observable<string[]>;
    filteredNoServiceOptions: Observable<string[]>;


    /**
     * Constructor
     *
     * @param entidadService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param router
     * @param _countries
     * @param _fuseProgressBarService
     */
    constructor(
        private entidadService: HotelService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private router: Router,
        private _countries: CountriesService,
        private _fuseProgressBarService: FuseProgressBarService,
    )
    {
        this.entidadConst = HotelConst;
        // Set the default
        this.entidad = new HotelModel();

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        this.monedas = this.entidadService.monedas;
        this.hotelTypes = this.entidadService.hotelTypes;
        this.tipoTarifaTypes = this.entidadService.tipoTarifaTypes;
        this.habitaciones = this.entidadService.habitaciones;
        this.servicios = this.entidadService.servicios;
        this.penalidades = this.entidadService.penalidades;
        this.entidadService.onEntidadChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(entidad => {
                if ( entidad )
                {
                    this.entidad = new HotelModel(entidad);
                    this.pageType = 'edit';
                }
                else
                {
                    this.pageType = 'new';
                    this.entidad = new HotelModel();
                }

                this.createEntidadForm();
            });
        await this._countries.iniSet();
        /*console.log('countries', this._countries.countries);
        console.log('regions', this._countries.regions);
        console.log('subRegions', this._countries.subRegions);*/
        this.regionGroups = [
            {type: 'Regiones', options: this._countries.regions},
            {type: 'Sub-Regiones', options: <string[]>(Object.values(this._countries.subRegions)).reduce((pre: string[], actu: string[]) => [...pre, ...actu] , [])},
            {type: 'Paises', options: this._countries.countries.map( c => c.name)}
        ];
    }

    getHabitaciones(): Habitacion[] {
        const habs = this.entidadForm.get('habitaciones').value;
        return this.habitaciones.filter( h =>
            !Utilities.arrays.findPropObjectInArray(habs, '_id', h._id)
        );
    }

    getServicios(): Servicio[] {
        const servs = [...this.entidadForm.get('servicios').value, ...this.entidadForm.get('serviciosNoIncluidos').value];
        return this.servicios.filter( s =>
            !Utilities.arrays.findPropObjectInArray(servs, '_id', s._id)
        );
    }

    getPenalidades(): Penalidad[] {
        const pens = this.entidadForm.get('penalidades').value;
        return this.penalidades.filter( p =>
            !Utilities.arrays.findPropObjectInArray(pens, '_id', p._id)
        );
    }

    getSelectedHabitaciones(): Habitacion[] {
        return this.entidadForm.get('habitaciones').value;
    }

    getSelectedServicios(): Servicio[] {
        return this.entidadForm.get('servicios').value;
    }

    getSelectedNoServicios(): Servicio[] {
        return this.entidadForm.get('serviciosNoIncluidos').value;
    }

    getSelectedPenalidades(): Penalidad[] {
        return this.entidadForm.get('penalidades').value;
    }

    getImagenes(): FileSys[] {
        return this.entidadForm.get('imagenes').value;
    }

    updateHabitaciones(): void {
        const habId = this.habitacionesForm.get('habitacion').value;
        if ( !habId )
        {
            return;
        }
        const habs = [...this.entidadForm.get('habitaciones').value, this.habitaciones.find(h => h._id === habId)];
        if (!Utilities.objects.areEquals(this.entidad.habitaciones, habs)) {
            this.entidadForm.markAsDirty();
        } else {
            // todo
        }
        this.entidadForm.controls['habitaciones'].setValue(habs);
        this.habitacionesForm.reset();
    }

    updateServicios(): void {
        const servId = this.serviciosForm.get('servicio').value;
        if ( !servId )
        {
            return;
        }
        const servs = [...this.entidadForm.get('servicios').value, this.servicios.find(s => s._id === servId)];
        if (!Utilities.objects.areEquals(this.entidad.servicios, servs)) {
            this.entidadForm.markAsDirty();
        } else {
            // todo
        }
        this.entidadForm.controls['servicios'].setValue(servs);
        this.serviciosForm.reset();
    }

    updateNoServicios(): void {
        const servId = this.noServiciosForm.get('servicio').value;
        if ( !servId )
        {
            return;
        }
        const servs = [...this.entidadForm.get('serviciosNoIncluidos').value, this.servicios.find(s => s._id === servId)];
        if (!Utilities.objects.areEquals(this.entidad.serviciosNoIncluidos, servs)) {
            this.entidadForm.markAsDirty();
        } else {
            // todo
        }
        this.entidadForm.controls['serviciosNoIncluidos'].setValue(servs);
        this.noServiciosForm.reset();
    }

    updatePenalidades(): void {
        const penID = this.penalidadesForm.get('penalidad').value;
        if ( !penID )
        {
            return;
        }
        const pens = [...this.entidadForm.get('penalidades').value, this.penalidades.find(p => p._id === penID)];
        if (!Utilities.objects.areEquals(this.entidad.penalidades, pens)) {
            this.entidadForm.markAsDirty();
        } else {
            // todo
        }
        this.entidadForm.controls['penalidades'].setValue(pens);
        this.penalidadesForm.reset();
    }

    updateImagenes(imagen): void {
        const imagenes = [...this.entidadForm.get('imagenes').value, imagen];
        if (!Utilities.objects.areEquals(this.entidad.imagenes, imagenes)) {
            this.entidadForm.markAsDirty();
        } else {
            // this.entidadForm.get('imagenes').markAsPristine();
        }
        this.entidadForm.controls['imagenes'].setValue(imagenes);
    }

    eliminarHab(id): void {
        const habs = [...this.entidadForm.get('habitaciones').value].filter(h => h._id !== id);
        this.entidadForm.controls['habitaciones'].setValue(habs);
    }

    eliminarServ(id): void {
        const servs = [...this.entidadForm.get('servicios').value].filter(s => s._id !== id);
        this.entidadForm.controls['servicios'].setValue(servs);
    }

    eliminarNoServ(id): void {
        const servs = [...this.entidadForm.get('serviciosNoIncluidos').value].filter(s => s._id !== id);
        this.entidadForm.controls['serviciosNoIncluidos'].setValue(servs);
    }

    eliminarPen(id): void {
        const pens = [...this.entidadForm.get('penalidades').value].filter(p => p._id !== id);
        this.entidadForm.controls['penalidades'].setValue(pens);
    }

    eliminarImg(imagen): void {
        const imgs = [...this.entidadForm.get('imagenes').value].filter(p => imagen.name !== p.name);
        this.entidadForm.controls['imagenes'].setValue(imgs);
        this.entidadForm.markAsDirty();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create entidad form
     *
     * @returns {FormGroup}
     */
    createEntidadForm(): void
    {
        this.habitacionesForm = this._formBuilder.group({
            habitacion: ['']
        });

        this.serviciosForm = this._formBuilder.group({
            servicio: ['']
        });

        this.noServiciosForm = this._formBuilder.group({
            servicio: ['']
        });

        this.penalidadesForm = this._formBuilder.group({
            penalidad: ['']
        });

        this.imagesForm = this._formBuilder.group({
            imagen: ['']
        });


        const email = this._formBuilder.group({
            pagos: [this.entidad.email.pagos, [Validators.email]],
            reservas: [this.entidad.email.reservas, [Validators.email]],
            jefeReservas: [this.entidad.email.jefeReservas, [Validators.email]],
        });

        const telefonos = this._formBuilder.group({
            pagos: [this.entidad.telefonos.pagos],
            reservas: [this.entidad.telefonos.reservas],
            jefeReservas: [this.entidad.telefonos.jefeReservas],
        });

        const ejecutivoVentas = this._formBuilder.group({
            nombre: [this.entidad.ejecutivoVentas.nombre],
            telefono: [this.entidad.ejecutivoVentas.telefono],
            email: [this.entidad.ejecutivoVentas.email, [Validators.email]]
        });

        const tarjetaCredito = this._formBuilder.group({
            disponible: [this.entidad.cuentaBancaria.formaPago.tarjetaCredito.disponible],
            porcentaje: [this.entidad.cuentaBancaria.formaPago.tarjetaCredito.porcentaje],
        });

        const transferencia = this._formBuilder.group({
            disponible: [this.entidad.cuentaBancaria.formaPago.transferencia.disponible],
            costoTransferencia: [this.entidad.cuentaBancaria.formaPago.transferencia.costoTransferencia],
            moneda: [this.entidad.cuentaBancaria.formaPago.transferencia.moneda === null ? this.monedas.find(m => m.defaultid < 0).id
                : this.entidad.cuentaBancaria.formaPago.transferencia.moneda.id],
        });

        const efectivo = this._formBuilder.group({
            disponible: [this.entidad.cuentaBancaria.formaPago.efectivo.disponible],
        });

        const formaPago = this._formBuilder.group({
            tarjetaCredito: tarjetaCredito,
            transferencia: transferencia,
            efectivo: efectivo
        });

        const cuentaBancaria = this._formBuilder.group({
            razonSocial: [this.entidad.cuentaBancaria.razonSocial],
            pais: [this.entidad.cuentaBancaria.pais],
            nombreBeneficiario: [this.entidad.cuentaBancaria.nombreBeneficiario],
            nombreBancoBeneficiario: [this.entidad.cuentaBancaria.nombreBancoBeneficiario],
            numeroCuenta: [this.entidad.cuentaBancaria.numeroCuenta],
            tipoCuenta: [this.entidad.cuentaBancaria.tipoCuenta],
            aba: [this.entidad.cuentaBancaria.aba],
            swift: [this.entidad.cuentaBancaria.swift],
            bancoIntermediario: [this.entidad.cuentaBancaria.bancoIntermediario],
            cuentaIntermediaria: [this.entidad.cuentaBancaria.cuentaIntermediaria],
            formaPago: formaPago,
            descripcion: [this.entidad.cuentaBancaria.descripcion],
        });
        this.paisfilteredOptions = cuentaBancaria.get('pais')!.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(value))
            );

        const cargoPromociones = this._formBuilder.group({
            name: [this.entidad.cargoPromociones.name],
            type: [this.entidad.cargoPromociones.type],
            data: [this.entidad.cargoPromociones.data],
        });

        const contrato = this._formBuilder.group({
            name: [this.entidad.contrato.name],
            type: [this.entidad.contrato.type],
            data: [this.entidad.contrato.data],
        });

        this.entidadForm = this._formBuilder.group({
            _id                 : [this.entidad._id],
            nombre              : [this.entidad.nombre, Validators.required],
            segmetohotel        : [this.entidad.segmetohotel, Validators.required],
            categoria           : [this.entidad.categoria],
            habitaciones        : [this.entidad.habitaciones],
            servicios           : [this.entidad.servicios],
            serviciosNoIncluidos: [this.entidad.serviciosNoIncluidos],
            penalidades         : [this.entidad.penalidades],
            region              : [this.entidad.region],
            regimenAlimentacion : this._formBuilder.array([]),
            tipoPlan            : this._formBuilder.array([]),
            tipoTarifa          : this._formBuilder.array([]),
            email               : email,
            telefonos           : telefonos,
            ejecutivoVentas     : ejecutivoVentas,
            cuentaBancaria      : cuentaBancaria,
            contrato            : contrato,
            cargoPromociones    : cargoPromociones,
            imagenes            : [this.entidad.imagenes],
            descripcion         : [this.entidad.descripcion],
            /*sistema           : [this.entidad.sistema]*/
        });
        this.hasFileCp = this.entidad.cargoPromociones.name.length > 0;
        this.hasFileCon = this.entidad.contrato.name.length > 0;

        this.regimenAlimentacion = this.entidadForm.get('regimenAlimentacion') as FormArray;
        this.tipoPlan = this.entidadForm.get('tipoPlan') as FormArray;
        this.tipoTarifa = this.entidadForm.get('tipoTarifa') as FormArray;
        this.iniRegimenAlimentacion();
        this.iniTipoPlan();
        this.iniTipoTarifa();
        this.regionGroupOptions = this.entidadForm.get('region')!.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filterGroup(value))
            );
    }

    private iniRegimenAlimentacion(): void {
        this.entidad.regimenAlimentacion.forEach(f => {
            this.regimenAlimentacion.push(this.insertRegimenAlimentacion(f));
        });
    }

    createRegimenAlimentacion(): FormGroup {
        return this._formBuilder.group({
            nombreRegimen: '',
            descripcion: ''
        });
    }

    addRegimenAlimentacion(): void {
        this.regimenAlimentacion.push(this.createRegimenAlimentacion());
    }

    removeRegimenAlimentacion (index): void {
        this.regimenAlimentacion.removeAt(index);
    }

    private insertRegimenAlimentacion({nombreRegimen, descripcion}): FormGroup {
        return this._formBuilder.group({
            nombreRegimen: nombreRegimen || '',
            descripcion: descripcion || '',
        });
    }

    private iniTipoPlan(): void {
        this.entidad.tipoPlan.forEach(f => {
            this.tipoPlan.push(this.insertTipoPlan(f));
        });
    }

    createTipoPlan(): FormGroup {
        return this._formBuilder.group({
            nombrePlna: '',
            descripcion: ''
        });
    }

    addTipoPlan(): void {
        this.tipoPlan.push(this.createTipoPlan());
    }

    removeTipoPlan (index): void {
        this.tipoPlan.removeAt(index);
    }

    private insertTipoPlan({nombrePlna, descripcion}): FormGroup {
        return this._formBuilder.group({
            nombrePlna: nombrePlna || '',
            descripcion: descripcion || '',
        });
    }

    private iniTipoTarifa(): void {
        this.entidad.tipoTarifa.forEach(f => {
            this.tipoTarifa.push(this.insertTipoTarifa(f));
        });
    }

    createTipoTarifa(): FormGroup {
        return this._formBuilder.group({
            tipoHabitacion: [],
            numPersonas: 0,
            tipo: this.tipoTarifaTypes[0],
            monto: 0,
            moneda: this.monedas.find(m => m.defaultid < 0).id,
        });
    }

    addTipoTarifa(): void {
        this.tipoTarifa.push(this.createTipoTarifa());
    }

    removeTipoTarifa (index): void {
        this.tipoTarifa.removeAt(index);
    }

    private insertTipoTarifa({tipoHabitacion, numPersonas, tipo, monto, moneda}): FormGroup {
        return this._formBuilder.group({
            tipoHabitacion: tipoHabitacion && tipoHabitacion._id ? tipoHabitacion._id : null,
            numPersonas: numPersonas || 0,
            tipo: tipo || this.tipoTarifaTypes[0],
            monto: monto || 0,
            moneda: Utilities.objects.isEmpty(moneda) ? this.monedas.find(m => m.defaultid < 0).id : moneda.id,
        });
    }

    monedaSimbolo(i): string {
        const {moneda} = this.tipoTarifa.value[i];
        return this.getMonedaSimbolo(moneda);
    }

    getMonedaSimbolo(moneda): string {
        return moneda && moneda.length > 0 ? this.monedas.find(m => m.id === moneda).currency_symbol
            : this.monedas.find(m => m.defaultid < 0).currency_symbol;
    }

    getTransferenciaModeloSimbolo(): string {
        const data = {...this.entidadForm.getRawValue()};
        return this.getMonedaSimbolo(data.cuentaBancaria.formaPago.transferencia.moneda);
    }

    /**
     * Save entidad
     */

    setNewData(): any {
        const data = {...this.entidadForm.getRawValue()};
        data.tipoTarifa = data.tipoTarifa.map(tt => {
            tt.moneda = this.monedas.find(m => m.id === tt.moneda);
            return tt;
        });
        data.cuentaBancaria.formaPago.transferencia.moneda = this.monedas.find(m => m.id === data.cuentaBancaria.formaPago.transferencia.moneda);
        return data;
    }

    saveEntidad(): void
    {
        const data = this.setNewData();
        this.entidadService.saveEntidad(Utilities.systems.setEntitySistema(data))
            .then(() => {

                // Trigger the subscription with new data
                this.entidadService.onEntidadChanged.next(data);

                // Show the success message
                this._matSnackBar.open(`${this.entidadConst.name} Guardado`, 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });
            });
    }

    /**
     * Add entidad
     */
    addEntidad(): void
    {
        const data = this.setNewData();

        this.entidadService.addEntidad(Utilities.systems.setEntitySistema(data))
            .then(() => {

                // Trigger the subscription with new data
                this.entidadService.onEntidadChanged.next(data);

                // Show the success message
                this._matSnackBar.open(`${this.entidadConst.name} Agregado`, 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });

                // Change the location with new one
                this._location.go(`${this.entidadConst.urlEntidad}/${ this.entidad._id}`);
            });
    }

    removeEntidad(): void
    {
        const data = this.entidadForm.getRawValue();

        this.entidadService.removeEntidad(data)
            .then(() => {

                // Show the success message
                this._matSnackBar.open(`${this.entidadConst.name} Borrado`, 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });

                // this._location.go(`${this.entidadConst.urlEntidades}`);
                this.router.navigate([`${this.entidadConst.urlEntidades}`]);
            });
    }

    private _filterGroup(value: string): RegionGroup[] {
        if (value) {
            return this.regionGroups
                .map(group => ({type: group.type, options: _filter(group.options, value)}))
                .filter(group => group.options.length > 0);
        }

        return this.regionGroups;
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this._countries.countries.map(c => c.name).filter(p => p.toLowerCase().includes(filterValue));
    }

    onFileChangeCp(event): void {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader: FileReader = new FileReader();
            this._fuseProgressBarService.show();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base: string = <string>reader.result;
                const base64 = base.split(',');
                const dataFile = {
                    name: file.name,
                    type: file.type,
                    data: base64[1]
                };
                const cargoPromociones = this.entidadForm.get('cargoPromociones');
                cargoPromociones.setValue(dataFile); // .get('data').setValue(dataFile);
                this.hasFileCp = true;
                this.entidadForm.get('cargoPromociones').markAsDirty();
                this._fuseProgressBarService.hide();
            };
        }
    }

    onFileChangeCon(event): void {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader: FileReader = new FileReader();
            this._fuseProgressBarService.show();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base: string = <string>reader.result;
                const base64 = base.split(',');
                const dataFile = {
                    name: file.name,
                    type: file.type,
                    data: base64[1]
                };
                const contrato = this.entidadForm.get('contrato');
                contrato.setValue(dataFile); // .get('data').setValue(dataFile);
                this.hasFileCon = true;
                this.entidadForm.get('contrato').markAsDirty();
                this._fuseProgressBarService.hide();
            };
        }
    }

    onImage(event): void {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader: FileReader = new FileReader();
            this._fuseProgressBarService.show();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base: string = <string>reader.result;
                const base64 = base.split(',');
                const dataFile = {
                    name: file.name,
                    type: file.type,
                    data: base64[1]
                };
                /*const imagenes = this.entidadForm.get('imagenes');
                const imagenesValue = this.getImagenes();
                imagenesValue.push(<FileSys>dataFile);
                imagenes.setValue(imagenesValue); // .get('data').setValue(dataFile);
                this.hasFileCon = true;
                this.entidadForm.get('imagenes').markAsDirty();*/
                this.updateImagenes(dataFile);
                this._fuseProgressBarService.hide();
            };
        }
    }

    deletefileCp(): void {
        const cargoPromociones = this.entidadForm.get('cargoPromociones');
        cargoPromociones.setValue({
            name: '',
            type: '',
            data: null,
        });
        this.hasFileCp === true
            ? this.entidadForm.get('cargoPromociones').markAsDirty()
            : this.entidadForm.get('cargoPromociones').markAsPristine();
        this.hasFileCp = false;
    }

    deletefileCon(): void {
        const contrato = this.entidadForm.get('contrato');
        contrato.setValue({
            name: '',
            type: '',
            data: null,
        });
        this.hasFileCon === true
            ? this.entidadForm.get('contrato').markAsDirty()
            : this.entidadForm.get('contrato').markAsPristine();
        this.hasFileCon = false;
    }

    downloadFileCp(): void {
        const {cargoPromociones} = this.entidadForm.getRawValue();
        const b64 = cargoPromociones.data; // Utilities.file.bufferToB64(cargoPromociones.data); // Utilities.file.arrayBufferToBase64(cargoPromociones.data); //
        Utilities.file.downloadFromDataURL(cargoPromociones.name,
            `data:${cargoPromociones.type};base64,${b64}`);
    }

    downloadFileCon(): void {
        const {contrato} = this.entidadForm.getRawValue();
        const b64 = contrato.data; // Utilities.file.bufferToB64(cargoPromociones.data); // Utilities.file.arrayBufferToBase64(cargoPromociones.data); //
        Utilities.file.downloadFromDataURL(contrato.name,
            `data:${contrato.type};base64,${b64}`);
    }

    downloadImage(image): void {
        const b64 = image.data; // Utilities.file.bufferToB64(cargoPromociones.data); // Utilities.file.arrayBufferToBase64(cargoPromociones.data); //
        Utilities.file.downloadFromDataURL(image.name,
            `data:${image.type};base64,${b64}`);
    }
}
