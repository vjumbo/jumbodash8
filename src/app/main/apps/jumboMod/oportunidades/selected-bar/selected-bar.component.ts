import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import {OportunidadesService} from '../oportunidades.service';


@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class OportunidadSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedOportunidades: boolean;
    isIndeterminate: boolean;
    selectedOportunidades: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {OportunidadesService} _oportunidadesService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _oportunidadesService: OportunidadesService,
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
        this._oportunidadesService.onSelectedEntidadesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedOportunidades => {
                this.selectedOportunidades = selectedOportunidades;
                setTimeout(() => {
                    this.hasSelectedOportunidades = selectedOportunidades.length > 0;
                    this.isIndeterminate = (selectedOportunidades.length !== this._oportunidadesService.entidades.length && selectedOportunidades.length > 0);
                }, 0);
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
     * Select all
     */
    selectAll(): void
    {
        this._oportunidadesService.selectEntidades();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._oportunidadesService.deselectEntidades();
    }

    /**
     * Delete selected oportunidades
     */
    deleteSelectedOportunidades(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Esta seguro que desea borrar todas las oportunidades seleccionadas?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._oportunidadesService.deleteSelectedEntidades();
                }
                this.confirmDialogRef = null;
            });
    }
}
