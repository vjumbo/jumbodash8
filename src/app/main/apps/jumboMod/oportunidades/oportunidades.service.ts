import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import {OportunidadModel} from './oportunidad.model';
import {VtigerServiceService} from '@service/vtiger.Service';



@Injectable()
export class OportunidadesService implements Resolve<any>
{
    onEntidadesChanged: BehaviorSubject<any>;
    onSelectedEntidadesChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    entidades: OportunidadModel[];
    user: any;
    selectedEntidades: string[] = [];

    searchText: string;
    filterBy: string;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param _vtgierService
     */
    constructor(
        private _httpClient: HttpClient,
        private _vtgierService: VtigerServiceService,
    )
    {
        // Set the defaults
        this.onEntidadesChanged = new BehaviorSubject([]);
        this.onSelectedEntidadesChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

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
                this.getEntidades(),
                // this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getEntidades();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getEntidades();
                    });

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
    async getEntidades(): Promise<any>
    {
        this.entidades = await this._vtgierService.doQuery('select * from Potentials');

        let arrSearch = ['Cotizado', 'Aceptado', 'Finalizado'];

        if (arrSearch.includes(this.filterBy)) {
            arrSearch = [this.filterBy];
        }
        this.entidades = this.entidades.filter(ent => arrSearch.includes(ent.service_status));


        if ( this.searchText && this.searchText !== '' )
        {
            this.entidades = FuseUtils.filterArrayByString(this.entidades, this.searchText);
        }

        this.entidades = this.entidades.map(entidades => {
            return new OportunidadModel(entidades);
        });

        this.onEntidadesChanged.next(this.entidades);

        return this.entidades;
    }

    /**
     * Get user data
     *
     * @returns {Promise<any>}
     */
    /*getUserData(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get('api/entidades-user/5725a6802d10e277a0f35724')
                    .subscribe((response: any) => {
                        this.user = response;
                        this.onUserDataChanged.next(this.user);
                        resolve(this.user);
                    }, reject);
            }
        );
    }*/

    /**
     * Toggle selected contact by id
     *
     * @param id
     */
    toggleSelectedEntidad(id): void
    {
        // First, check if we already have that contact as selected...
        if ( this.selectedEntidades.length > 0 )
        {
            const index = this.selectedEntidades.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedEntidades.splice(index, 1);

                // Trigger the next event
                this.onSelectedEntidadesChanged.next(this.selectedEntidades);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedEntidades.push(id);

        // Trigger the next event
        this.onSelectedEntidadesChanged.next(this.selectedEntidades);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedEntidades.length > 0 )
        {
            this.deselectEntidades();
        }
        else
        {
            this.selectEntidades();
        }
    }

    /**
     * Select entidades
     *
     * @param filterParameter
     * @param filterValue
     */
    selectEntidades(filterParameter?, filterValue?): void
    {
        this.selectedEntidades = [];

        // If there is no filter, select all entidades
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedEntidades = [];
            this.entidades.map(contact => {
                this.selectedEntidades.push(contact.id);
            });
        }

        // Trigger the next event
        this.onSelectedEntidadesChanged.next(this.selectedEntidades);
    }

    /**
     * Update contact
     *
     * @param contact
     * @returns {Promise<any>}
     */
    updateEntidades(contact): Promise<any>
    {
        return new Promise((resolve, reject) => {

            this._httpClient.post('api/entidades-entidades/' + contact.id, {...contact})
                .subscribe(response => {
                    this.getEntidades();
                    resolve(response);
                });
        });
    }

    /**
     * Update user data
     *
     * @param userData
     * @returns {Promise<any>}
     */
    /*updateUserData(userData): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/entidades-user/' + this.user.id, {...userData})
                .subscribe(response => {
                    // this.getUserData();
                    this.getEntidades();
                    resolve(response);
                });
        });
    }*/

    /**
     * Deselect entidades
     */
    deselectEntidades(): void
    {
        this.selectedEntidades = [];

        // Trigger the next event
        this.onSelectedEntidadesChanged.next(this.selectedEntidades);
    }

    /**
     * Delete contact
     *
     * @param contact
     */
    deleteEntidad(contact): void
    {
        const contactIndex = this.entidades.indexOf(contact);
        this.entidades.splice(contactIndex, 1);
        this.onEntidadesChanged.next(this.entidades);
    }

    /**
     * Delete selected entidades
     */
    deleteSelectedEntidades(): void
    {
        for ( const contactId of this.selectedEntidades )
        {
            const contact = this.entidades.find(_contact => {
                return _contact.id === contactId;
            });
            const contactIndex = this.entidades.indexOf(contact);
            this.entidades.splice(contactIndex, 1);
        }
        this.onEntidadesChanged.next(this.entidades);
        this.deselectEntidades();
    }

}
