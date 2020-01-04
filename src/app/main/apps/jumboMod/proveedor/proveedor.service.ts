import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {Hotel, Moneda, Proveedor, ProveedorCrmInfo} from '@configs/interfaces';
import {BackEndConst} from '@configs/constantes';
import {VtigerServiceService} from '@service/vtiger.Service';
import {RequestServices} from '@service/servicios.service';

@Injectable()
export class ProveedorService implements Resolve<any>
{
    routeParams: any;
    entidad: ProveedorCrmInfo;
    onEntidadChanged: BehaviorSubject<any>;
    hoteles: Hotel[];
    monedas: Moneda[];
    url = `${BackEndConst.backEndUrl}${BackEndConst.endPoints.proveedores}`; // ${BackEndConst.endPoints.proveedores}

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
        this.hoteles = await <any>this.requestServices.reqGet(`${BackEndConst.backEndUrl}${BackEndConst.endPoints.hoteles}`).toPromise();
        return new Promise((resolve, reject) => {
            if ( !this.routeParams.id ) // === 'new'
            {
                this.onEntidadChanged.next(false);
                resolve(false);
            }
            else
            {
                this._vtgierService.doRetrieve(this.routeParams.id)
                    .then(prov => {
                        this.requestServices.reqGet(`${this.url}/${this.routeParams.id}`)
                            .subscribe((response: any) => {
                                this.entidad = {
                                    id: this.routeParams.id,
                                    crmInfo: prov,
                                    proveedor: !response ? {} : response
                                };
                                this.onEntidadChanged.next(this.entidad);
                                resolve(this.entidad);
                            }, reject);
                    });
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
