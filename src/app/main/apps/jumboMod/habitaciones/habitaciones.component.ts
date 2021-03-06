import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatSnackBar, MatSort} from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import {HabitacionesService} from './habitaciones.service';
import {HabitacionConst} from '../habitacion/habitacion.model';

@Component({
    selector   : 'jum-habitaciones',
    templateUrl: './habitaciones.component.html',
    styleUrls  : ['./habitaciones.component.scss'],
    animations : fuseAnimations
})
export class HabitacionesComponent implements OnInit
{
    dataSource: FilesDataSource | null;
    displayedColumns = ['id', 'nombre', 'descripcion', 'capacidad', 'adulto', 'ninos', 'inf', 'tipoCama', 'usuario'];

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;

    entidadesConst: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _EntidadesService: HabitacionesService,
        private _matSnackBar: MatSnackBar
    )
    {
        this.entidadesConst = HabitacionConst;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.dataSource = new FilesDataSource(this._EntidadesService, this.paginator, this.sort);

        fromEvent(this.filter.nativeElement, 'keyup')
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if ( !this.dataSource )
                {
                    return;
                }

                this.dataSource.filter = this.filter.nativeElement.value;
            });
    }

    getIDPos(id): number {
        return (this._EntidadesService.entidades.findIndex(e => e._id === id)) + 1;
    }
}

export class FilesDataSource extends DataSource<any>
{
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');

    /**
     * Constructor
     *
     * @param {HabitacionesService} _EntidadesService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _EntidadesService: HabitacionesService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    )
    {
        super();

        this.filteredData = this._EntidadesService.entidades;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        const displayDataChanges = [
            this._EntidadesService.onEntidadesChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                        let data = this._EntidadesService.entidades.slice();

                        data = this.filterData(data);

                        this.filteredData = [...data];

                        data = this.sortData(data);

                        // Grab the page's slice of data.
                        const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
                        return data.splice(startIndex, this._matPaginator.pageSize);
                    }
                ));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Filtered data
    get filteredData(): any
    {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any)
    {
        this._filteredDataChange.next(value);
    }

    // Filter
    get filter(): string
    {
        return this._filterChange.value;
    }

    set filter(filter: string)
    {
        this._filterChange.next(filter);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter data
     *
     * @param data
     * @returns {any}
     */
    filterData(data): any
    {
        if ( !this.filter )
        {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }

    /**
     * Sort data
     *
     * @param data
     * @returns {any[]}
     */
    sortData(data): any[]
    {
        if ( !this._matSort.active || this._matSort.direction === '' )
        {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch ( this._matSort.active )
            {
                case 'id':
                    [propertyA, propertyB] = [a.id, b.id];
                    break;
                case 'nombre':
                    [propertyA, propertyB] = [a.nombre, b.nombre];
                    break;
                case 'descripcion':
                    [propertyA, propertyB] = [a.descripcion, b.descripcion];
                    break;
                case 'capacidad':
                    [propertyA, propertyB] = [a.capacidad, b.capacidad];
                    break;
                case 'adulto':
                    [propertyA, propertyB] = [a.adulto, b.adulto];
                    break;
                case 'ninos':
                    [propertyA, propertyB] = [a.ninos, b.ninos];
                    break;
                case 'inf':
                    [propertyA, propertyB] = [a.inf, b.inf];
                    break;
                case 'tipoCama':
                    [propertyA, propertyB] = [a.tipoCama, b.tipoCama];
                    break;
                case 'usuario':
                    [propertyA, propertyB] = [a.usuario, b.usuario];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
        });
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
