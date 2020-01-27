import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {RequestServices} from '@service/servicios.service';
import {Utilities} from '@utilities/utilities';
import {FormGroup} from '@angular/forms';
import {Hotel, HotelesDoc} from '@configs/interfaces';

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

    updateHoteles(
        {hoteles, entidad, hotelesForm, entidadForm}: {hoteles: Hotel[], entidad: any, hotelesForm: FormGroup, entidadForm: FormGroup}
        ): void {
        const hotId = hotelesForm.get('hotel').value;
        if ( !hotId )
        {
            return;
        }
        const hots = [...entidadForm.get('hoteles').value, hoteles.find(h => h._id === hotId)];
        if (!Utilities.objects.areEquals(entidad.hoteles, hots)) {
            entidadForm.get('hoteles').markAsDirty();
        } else {
            // todo
        }
        entidadForm.controls['hoteles'].setValue(hots);
        hotelesForm.reset();
    }

    updateHotelesDoc(
        {hoteles, entidad, hotelesForm, entidadForm}: {hoteles: HotelesDoc[], entidad: any, hotelesForm: FormGroup, entidadForm: FormGroup}
    ): void {
        const hotId = hotelesForm.get('hotel').value;
        if ( !hotId )
        {
            return;
        }
        const hots = [...entidadForm.get('hoteles').value, hoteles.find(h => h.idHotel === hotId)];
        if (!Utilities.objects.areEquals(entidad.hoteles, hots)) {
            entidadForm.get('hoteles').markAsDirty();
        } else {
            // todo
        }
        entidadForm.controls['hoteles'].setValue(hots);
        hotelesForm.reset();
    }

    getHoteles({hoteles, entidadForm}: {hoteles: Hotel[], entidadForm: FormGroup}
    ): Hotel[] {
        const hots = entidadForm.get('hoteles').value;
        return Utilities.arrays.sortAsc(hoteles.filter( h =>
            !Utilities.arrays.findPropObjectInArray(hots, '_id', h._id)
        ), 'nombre');
    }

    getHotelesDoc({hoteles, entidadForm}: {hoteles: HotelesDoc[], entidadForm: FormGroup}
    ): HotelesDoc[] {
        const hots = entidadForm.get('hoteles').value;
        return Utilities.arrays.sortAsc(hoteles.filter( h =>
            !Utilities.arrays.findPropObjectInArray(hots, 'idHotel', h.idHotel)
        ), 'nombre');
    }
}
