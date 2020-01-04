import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { Location } from '@angular/common';
import {MatSnackBar} from '@angular/material';
import {Observable, Subject} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import {ProveedorModel, ProveedorConst} from './proveedor.model';
import {ProveedorService} from './proveedor.service';
import {Router} from '@angular/router';
import {Hotel, Moneda} from '@configs/interfaces';
import {Utilities} from '@utilities/utilities';
import {CountriesService} from '@service/countries.service';
import {FuseProgressBarService} from '@fuse/components/progress-bar/progress-bar.service';


@Component({
    selector     : 'jum-proveedor',
    templateUrl  : './proveedor.component.html',
    styleUrls    : ['./proveedor.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ProveedorComponent implements OnInit, OnDestroy
{
    id: string;
    info: any;
    entidad: ProveedorModel;
    pageType: string;
    entidadForm: FormGroup;
    entidadConst: any;
    hoteles: Hotel[];
    hotelesForm: FormGroup;
    monedas: Moneda[];
    hasFileCp = false;
    hasFileCon = false;

    // Private
    private _unsubscribeAll: Subject<any>;

    paisfilteredOptions: Observable<string[]>;

    /**
     * Constructor
     *
     * @param {ProveedorService} entidadService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param router
     * @param _countries
     * @param _fuseProgressBarService
     */
    constructor(
        private entidadService: ProveedorService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private router: Router,
        private _countries: CountriesService,
        private _fuseProgressBarService: FuseProgressBarService,
    )
    {
        this.entidadConst = ProveedorConst;
        // Set the default
        // this.entidad = new ProveedorModel();

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
        this.hoteles = this.entidadService.hoteles;
        this.entidadService.onEntidadChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(entidad => {
                if ( entidad )
                {
                    this.id = entidad.id;
                    this.info = entidad.crmInfo;
                    this.entidad = new ProveedorModel(entidad.proveedor, this.info);
                    this.pageType = 'edit';
                    this.entidad.hoteles = this.entidad.hoteles.map(h => {
                        if (Utilities.strings.isString(h)) {
                            return this.hoteles.find((x: any) => {
                                return (x._id === h);
                            });
                        } else {
                            return h;
                        }
                    });
                }
                else
                {
                    this.pageType = 'new';
                    this.entidad = new ProveedorModel();
                }

                this.createEntidadForm();
            });
        await this._countries.iniSet();
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
        this.hotelesForm = this._formBuilder.group({
            hotel: ['']
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
            nombre              : [this.entidad.nombre],
            hoteles             : [this.entidad.hoteles],
            email               : [this.entidad.email],
            telefono            : [this.entidad.telefono],
            cuentaBancaria      : cuentaBancaria,
            contrato            : contrato,
            cargoPromociones    : cargoPromociones,
            descripcion         : [this.entidad.descripcion],
           /*sistema             : [this.entidad.sistema]*/
        });
        this.hasFileCp = this.entidad.cargoPromociones.name.length > 0;
        this.hasFileCon = this.entidad.contrato.name.length > 0;
    }

    /**
     * Save entidad
     */
    setNewData(): any {
        const data = {...this.entidadForm.getRawValue()};
        data.cuentaBancaria.formaPago.transferencia.moneda = this.monedas.find(m => m.id === data.cuentaBancaria.formaPago.transferencia.moneda);
        return data;
    }


    saveEntidad(): void
    {
        const data = this.setNewData();
        if (data._id === null) {
            this.addEntidad();
            return;
        }
        data['crmid'] = this.entidad.crmid;
        data['crmInfo'] = this.entidad.crmInfo;
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
        data['crmid'] = this.entidad.crmid;
        data['crmInfo'] = this.entidad.crmInfo;
        this.entidadService.addEntidad(Utilities.systems.setEntitySistema(data))
            .then(() => {
                const newEntidad = {
                    id: this.id,
                    crmInfo: this.info,
                    proveedor: data
                };
                // Trigger the subscription with new data
                this.entidadService.onEntidadChanged.next(newEntidad);

                // Show the success message
                this._matSnackBar.open(`${this.entidadConst.name} Agregado`, 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });

                // Change the location with new one
                this._location.go(`${this.entidadConst.urlEntidad}/${ this.id}`);
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

    getHoteles(): Hotel[] {
        const hots = this.entidadForm.get('hoteles').value;
        return this.hoteles.filter( h =>
            !Utilities.arrays.findPropObjectInArray(hots, '_id', h._id)
        );
    }

    getSelectedHoteles(): Hotel[] {
        return this.entidadForm.get('hoteles').value;
    }

    updateHoteles(): void {
        const hotId = this.hotelesForm.get('hotel').value;
        if ( !hotId )
        {
            return;
        }
        const hots = [...this.entidadForm.get('hoteles').value, this.hoteles.find(h => h._id === hotId)];
        if (!Utilities.objects.areEquals(this.entidad.hoteles, hots)) {
            this.entidadForm.get('hoteles').markAsDirty();
        } else {
            // todo
        }
        this.entidadForm.controls['hoteles'].setValue(hots);
        this.hotelesForm.reset();
    }

    eliminarHot(id): void {
        const hots = [...this.entidadForm.get('hoteles').value].filter(h => h._id !== id);
        this.entidadForm.controls['hoteles'].setValue(hots);
        if (hots.length === 0) {
            this.entidadForm.get('hoteles').markAsPristine();
        }
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this._countries.countries.map(c => c.name).filter(p => p.toLowerCase().includes(filterValue));
    }

    getMonedaSimbolo(moneda): string {
        return moneda && moneda.length > 0 ? this.monedas.find(m => m.id === moneda).currency_symbol
            : this.monedas.find(m => m.defaultid < 0).currency_symbol;
    }

    getTransferenciaModeloSimbolo(): string {
        const data = {...this.entidadForm.getRawValue()};
        return this.getMonedaSimbolo(data.cuentaBancaria.formaPago.transferencia.moneda);
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
 }
