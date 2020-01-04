import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import {VtigerServiceService} from '@service/vtiger.Service';
import {FuseProgressBarService} from '@fuse/components/progress-bar/progress-bar.service';
import {Router} from '@angular/router';
import {JumboBackEndService} from '@service/jumbo-back-end.service';
import {CrmConst} from '@configs/constantes';
import {Usuario} from '@configs/interfaces';
import {Utilities} from '@utilities/utilities';

@Component({
    selector     : 'vt-login',
    templateUrl  : './vt-login.component.html',
    styleUrls    : ['./vt-login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class VtLoginComponent implements OnInit
{
    loginForm: FormGroup;
    loginError: any;
    logo: string;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param vtService
     * @param _fuseProgressBarService
     * @param route
     * @param backEndService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private vtService: VtigerServiceService,
        private _fuseProgressBarService: FuseProgressBarService,
        private route: Router,
        private backEndService: JumboBackEndService
    )
    {
        this.loginError = null;
        this.logo = CrmConst.logoDir;
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            user   : ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    async setLogin (): Promise<void> {
        this._fuseProgressBarService.show();
        const user = this.loginForm.value;
        // user.password = LogicaService.Md5(user.password);
        console.log(user);
        try {
            const res = await this.vtService.doDashLogin(user.user, user.password);
            console.log(res);
            if (res !== null) {
                try {
                    const beUser = await this.backEndService.getUserByUsername(user.user);
                    if (<any>beUser === false) {
                        const newUser: Usuario = <Usuario>{
                            username: res.userName,
                            apikey: res.apiKey,
                            crmid: res.userId,
                            userInfo: Utilities.currentUser.getCurrentUser(),
                            sistema: {
                                fechaCreacion: new Date(),
                                fechaModificacion: new Date()
                            }
                        };
                        try {
                            const usuario = await this.backEndService.saveNewUser(newUser);
                            this.setDashUser(usuario);
                        } catch (e) {
                            Utilities.logins.logOff();
                        }
                    } else {
                        this.setDashUser(beUser);
                    }
                } catch (e) {
                    Utilities.logins.logOff();
                    throw Error(e);
                }
            } else {
                Utilities.logins.logOff();
                throw Error('Error al Iniciar Sesion');
            }
        } catch (e) {
            this.onCatch(e);
        }
    }

    onCatch(error): void {
        this.loginError = error;
        this._fuseProgressBarService.hide();
    }

    setDashUser(usuario): void {
        const crUser = Utilities.currentUser.getCurrentUser();
        crUser['DashUser'] = usuario;
        Utilities.currentUser.setCurrentUser(crUser);
        const crUser2 = Utilities.currentUser.getCurrentUser();
        if (usuario.token === crUser2.DashUser.token) {
            Utilities.logins.setLoggedin();
            this._fuseProgressBarService.hide();
            this.route.navigate(['/']);
        } else {
            alert('not equal');
            Utilities.logins.logOff();
            this.onCatch('no equal token');
        }
    }
}
