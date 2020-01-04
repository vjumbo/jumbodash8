import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import {OportunidadesService} from '../oportunidades.service';
import {OportunidadModelsOportunidadModelFormDialogComponent} from '../oportunidad-form/oportunidad-form.component';


@Component({
    selector     : 'oportunidades-list',
    templateUrl  : './oportunidad-list.component.html',
    styleUrls    : ['./oportunidad-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class OportunidadListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent', {static: true})
    dialogContent: TemplateRef<any>;

    oportunidades: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['potential_no', 'potentialname', 'sales_stage', 'service_status'];
    selectedOportunidades: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {OportunidadesService} entidadesService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private entidadesService: OportunidadesService,
        public _matDialog: MatDialog
    )
    {
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
        this.dataSource = new FilesDataSource(this.entidadesService);

        this.entidadesService.onEntidadesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(oportunidades => {
                this.oportunidades = oportunidades;

                this.checkboxes = {};
                oportunidades.map(oportunidad => {
                    this.checkboxes[oportunidad.id] = false;
                });
            });

        this.entidadesService.onSelectedEntidadesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedOportunidades => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedOportunidades.includes(id);
                }
                this.selectedOportunidades = selectedOportunidades;
            });

        this.entidadesService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this.entidadesService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.entidadesService.deselectEntidades();
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
     * Edit oportunidad
     *
     * @param oportunidad
     */
    editOportunidad(oportunidad): void
    {
        this.dialogRef = this._matDialog.open(OportunidadModelsOportunidadModelFormDialogComponent, {
            panelClass: 'oportunidad-form-dialog',
            data      : {
                oportunidad: oportunidad,
                action : 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'save':

                        this.entidadesService.updateEntidades(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteOportunidad(oportunidad);

                        break;
                }
            });
    }

    /**
     * Delete Oportunidad
     */
    deleteOportunidad(oportunidad): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.entidadesService.deleteEntidad(oportunidad);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param oportunidadId
     */
    onSelectedChange(oportunidadId): void
    {
        this.entidadesService.toggleSelectedEntidad(oportunidadId);
    }

    /**
     * Toggle star
     *
     * @param oportunidadId
     */
    toggleStar(oportunidadId): void
    {
        if ( this.user.starred.includes(oportunidadId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(oportunidadId), 1);
        }
        else
        {
            this.user.starred.push(oportunidadId);
        }

        // this.entidadesService.updateUserData(this.user);
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {OportunidadesService} entidadesService
     */
    constructor(
        private entidadesService: OportunidadesService
    )
    {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this.entidadesService.onEntidadesChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
