import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {Habitacion, Hotel, Moneda, Penalidad, Servicio} from '@configs/interfaces';
import {BackEndConst} from '@configs/constantes';
import {RequestServices} from '@service/servicios.service';
import {VtigerServiceService} from '@service/vtiger.Service';

@Injectable()
export class HotelService implements Resolve<any>
{
    routeParams: any;
    entidad: Hotel;
    hotelTypes: string[];
    tipoTarifaTypes: string[];
    habitaciones: Habitacion[];
    servicios: Servicio[];
    penalidades: Penalidad[];
    monedas: Moneda[];
    onEntidadChanged: BehaviorSubject<any>;
    url = `${BackEndConst.backEndUrl}${BackEndConst.endPoints.hoteles}`;


    /**
     * Constructor
     *
     * @param requestServices
     * @param _vtgierService
     */
    constructor(
        private requestServices: RequestServices,
        private _vtgierService: VtigerServiceService,
    )
    {
        // Set the defaults
        this.onEntidadChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getEntidad()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get entidad
     *
     * @returns {Promise<any>}
     */
    async getEntidad(): Promise<any>
    {
        this.monedas = await this._vtgierService.doQuery('select * from Currency');
        this.hotelTypes = await <any>this.requestServices.reqGet(`${this.url}/hoteltypes`).toPromise();
        this.tipoTarifaTypes = await <any>this.requestServices.reqGet(`${this.url}/tipotarifatypes`).toPromise();
        this.habitaciones = await <any>this.requestServices.reqGet(`${BackEndConst.backEndUrl}${BackEndConst.endPoints.habitaciones}`).toPromise();
        this.servicios = await <any>this.requestServices.reqGet(`${BackEndConst.backEndUrl}${BackEndConst.endPoints.servicios}`).toPromise();
        this.penalidades = await <any>this.requestServices.reqGet(`${BackEndConst.backEndUrl}${BackEndConst.endPoints.penalidades}`).toPromise();
        return new Promise((resolve, reject) => {
            if ( !this.routeParams.id ) // === 'new'
            {
                this.onEntidadChanged.next(false);
                resolve(false);
            }
            else
            {
                this.requestServices.reqGet(`${this.url}/${this.routeParams.id}`)
                    .subscribe((response: any) => {
                        this.entidad = response;
                        this.onEntidadChanged.next(this.entidad);
                        resolve(response);
                    }, reject);
            }
        });
    }

    /**
     * Save entidad
     *
     * @param entidad
     * @returns {Promise<any>}
     */
    saveEntidad(entidad: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.requestServices.reqPut(`${this.url}/${entidad._id}`, entidad)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Add entidad
     *
     * @param entidad
     * @returns {Promise<any>}
     */
    addEntidad(entidad: any): Promise<any>
    {
        if (entidad._id === null) {
            delete entidad._id;
        }
        return new Promise((resolve, reject) => {
            this.requestServices.reqPost(`${this.url}`, entidad)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Remove entidad
     *
     * @returns {Promise<any>}
     */
    removeEntidad(entidad: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.requestServices.reqDel(`${this.url}/${entidad._id}`)
                .subscribe((response: any) => {
                    this.entidad = response;
                    this.onEntidadChanged.next(this.entidad);
                    resolve(response);
                }, reject);
        });
    }
}
