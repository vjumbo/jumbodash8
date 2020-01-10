import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {Cotizacion, Habitacion, Hotel, Moneda, Penalidad, Servicio} from '@configs/interfaces';
import {BackEndConst} from '@configs/constantes';
import {RequestServices} from '@service/servicios.service';
import {VtigerServiceService} from '@service/vtiger.Service';
import {EntidadFuntionsService} from '@service/entidad-funtions.service';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService implements Resolve<any> {
    routeParams: any;
    entidad: Cotizacion[];
    hoteles: Hotel[];
    monedas: Moneda[];
    onEntidadChanged: BehaviorSubject<any>;
    oportunidad: any;
    asesor: any;
    contact: any;
    url = `${BackEndConst.backEndUrl}${BackEndConst.endPoints.docs}`;

    getId = (id) => {
        const data = id.split('x');
        return data[1];
    }

    /**
     * Constructor
     *
     * @param requestServices
     * @param _vtgierService
     * @param entidadFuntionsService
     */
   constructor(
       private requestServices: RequestServices,
       private _vtgierService: VtigerServiceService,
       private entidadFuntionsService: EntidadFuntionsService,
   ) {
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
        const oportunidad = await this._vtgierService
            .doQuery(`select * from Potentials where id = ${this.routeParams.id}`);
        this.oportunidad = oportunidad[0];
        const asesor = await this._vtgierService
            .doQuery(`select * from Users where id = ${this.oportunidad.assigned_user_id}`);
        this.asesor = asesor[0];
        const contact = await this._vtgierService
            .doQuery(`select * from Contacts where id = ${this.oportunidad.contact_id}`);
        this.contact = contact[0];
        console.log(this.contact);
        this.hoteles = await this.requestServices.reqGet(
            `${BackEndConst.backEndUrl}${BackEndConst.endPoints.hoteles}`).toPromise() as any;
        return this.entidadFuntionsService.getEntidad(
            this.routeParams.id,
            this.onEntidadChanged,
            this.entidad,
            `${this.url}/oportunidad`
        );
    }
}
