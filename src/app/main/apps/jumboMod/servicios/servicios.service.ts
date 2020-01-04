import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {Servicio} from '@configs/interfaces';
import {BackEndConst} from '@configs/constantes';
import {RequestServices} from '@service/servicios.service';

@Injectable()
export class ServiciosService implements Resolve<any>
{
    entidades: Servicio[];
    onEntidadesChanged: BehaviorSubject<any>;
    url = `${BackEndConst.backEndUrl}${BackEndConst.endPoints.servicios}`;

    /**
     * Constructor
     *
     * @param requestServices
     */
    constructor(
        private requestServices: RequestServices
    )
    {
        // Set the defaults
        this.onEntidadesChanged = new BehaviorSubject({});
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
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getEntidades()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get entidades
     *
     * @returns {Promise<any>}
     */
    getEntidades(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.requestServices.reqGet(this.url) // {token: this.token}
                .subscribe((response: any[]) => {
                    this.entidades = response;
                    this.onEntidadesChanged.next(this.entidades);
                    resolve(response);
                }, reject);
        });
    }
}
