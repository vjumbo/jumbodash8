import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import {MatSnackBar} from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import {ServicioModel, ServicioConst} from './servicio.model';
import {ServicioService} from './servicio.service';
import {Router} from '@angular/router';
import {Moneda, Sistema} from '@configs/interfaces';
import {Utilities} from '@utilities/utilities';
import {CountriesService} from '@service/countries.service';


@Component({
    selector     : 'jum-servicio',
    templateUrl  : './servicio.component.html',
    styleUrls    : ['./servicio.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ServicioComponent implements OnInit, OnDestroy
{
    entidad: ServicioModel;
    pageType: string;
    entidadForm: FormGroup;
    entidadConst: any;
    monedas: Moneda[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param entidadService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param router
     */
    constructor(
        private entidadService: ServicioService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private router: Router,
    )
    {
        this.entidadConst = ServicioConst;
        // Set the default
        this.entidad = new ServicioModel();

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.monedas = [];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        this.monedas = this.entidadService.monedas;
        console.log('monedas crm', this.monedas);
        // Subscribe to update entidad on changes
        this.entidadService.onEntidadChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(entidad => {
                if ( entidad )
                {
                    this.entidad = new ServicioModel(entidad);
                    this.pageType = 'edit';
                }
                else
                {
                    this.pageType = 'new';
                    this.entidad = new ServicioModel();
                }

                this.entidadForm = this.createEntidadForm();
            });
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
    createEntidadForm(): FormGroup
    {
        return this._formBuilder.group({
            _id              : [this.entidad._id],
            nombre          : [this.entidad.nombre, Validators.required],
            descripcion     : [this.entidad.descripcion],
            costo           : [this.entidad.costo],
            moneda          : [
                Utilities.objects.isEmpty(this.entidad.moneda) ? this.monedas.find(m => m.defaultid < 0).id : this.entidad.moneda.id,
                Validators.required
            ],
            /*sistema          : [this.entidad.sistema]*/
        });
    }


    monedaSimbolo(): string {
        const {moneda} = this.entidadForm.getRawValue();
        return moneda && moneda.length > 0 ? this.monedas.find(m => m.id === moneda).currency_symbol : '#';
    }

    setNewData(): any {
        const data = {...this.entidadForm.getRawValue()};
        data.moneda = this.monedas.find(m => m.id === data.moneda);
        return data;
    }

    /**
     * Save entidad
     */
    saveEntidad(): void
    {
        this.entidadService.saveEntidad(Utilities.systems.setEntitySistema(this.setNewData()))
            .then(() => {

                // Trigger the subscription with new data
                this.entidadService.onEntidadChanged.next(this.setNewData());

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
        this.entidadService.addEntidad(Utilities.systems.setEntitySistema(this.setNewData()))
            .then(() => {

                // Trigger the subscription with new data
                this.entidadService.onEntidadChanged.next(this.setNewData());

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

        this.entidadService.removeEntidad(this.setNewData())
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
}
