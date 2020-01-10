import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {RequestServices} from '@service/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class EntidadFuntionsService {

  constructor(
      private requestServices: RequestServices,
  ) { }

    getEntidad(routeParams: any, onEntidadChanged: BehaviorSubject<any>, entidad: any, url: string): Promise<boolean | any>
    {
        return new Promise((resolve, reject) => {
            if ( !routeParams.id ) // === 'new'
            {
                onEntidadChanged.next(false);
                resolve(false);
            }
            else
            {
                this.requestServices.reqGet(`${url}/${routeParams.id}`)
                    .subscribe((response: any) => {
                        entidad = response;
                        onEntidadChanged.next(entidad);
                        resolve(response);
                    }, reject);
            }
        });
    }
}
