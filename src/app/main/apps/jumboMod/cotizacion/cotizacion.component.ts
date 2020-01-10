import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CotizacionService} from './cotizacion.service';
import {FuseProgressBarService} from '@fuse/components/progress-bar/progress-bar.service';
import {CotizacionesConst} from './cotizacion.const';
import {CotizacionesModel, CotizacionModel} from './cotizacion.model';
import {Cotizacion, Hotel, HotelesDoc, Moneda} from '@configs/interfaces';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {fuseAnimations} from '@fuse/animations';
import {Utilities} from '@utilities/utilities';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class CotizacionComponent implements OnInit {
    id: string;
    status: string;
    pageType: string;
    oportunidad: any;
    entidad: Cotizacion;
    entidades: CotizacionesModel;
    entidadForm: FormGroup;
    entidadConst = CotizacionesConst;
    hoteles: Hotel[];
    hotelesForm: FormGroup;
    hotelesFormArray: FormArray;
    habitacionesForm: FormGroup;
    serviciosForm: FormGroup;
    monedas: Moneda[];
    asesor: any;
    contact: any;
    private _unsubscribeAll: Subject<any>;

  constructor(
      private route: ActivatedRoute,
      private entidadService: CotizacionService,
      private _formBuilder: FormBuilder,
      private _fuseProgressBarService: FuseProgressBarService,
  ) {
      // this.entidad = new CotizacionModel();
      this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
      this.id = this.route.snapshot.params.id;
      this.status = this.route.snapshot.params.status;
      this.monedas = this.entidadService.monedas;
      this.hoteles = this.entidadService.hoteles;
      this.oportunidad = this.entidadService.oportunidad;
      this.asesor = this.entidadService.asesor;
      this.contact = this.entidadService.contact;
      this.entidadService.onEntidadChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(entidad => {
              if ( entidad )
              {
                  this.entidades = new CotizacionesModel(entidad, this.status, this.oportunidad, this.contact);
                  this.pageType = 'edit';
              }
              else
              {
                  this.pageType = 'new';
                  this.entidades = new CotizacionesModel(null, this.status, this.oportunidad, this.contact);
              }
              this.entidad = this.entidades.getActualDoc();

              this.createEntidadForm();
          });
  }

    createEntidadForm(): void{
      const asesor = this.entidad.asesor || this.asesor.user_name;
      const email = this.entidad.emailAsesor || this.asesor.email1;
      const telefono = this.entidad.telefono || this.asesor.phone_work;
      const nombreCliente = this.entidad.nombreCliente || `${this.contact.firstname} ${this.contact.lastname}`;
      const telefonoCliente = this.entidad.telefonoCliente
        || this.contact.phone ? this.contact.phone : this.contact.mobile;
      const emailCliente = this.entidad.emailCliente || this.contact.email;

      this.hotelesForm = this._formBuilder.group({
            hotel: ['']
        });

      this.entidadForm = this._formBuilder.group({
            fechaElaboracion    : [this.entidad.fechaElaboracion],
            asesor              : [asesor],
            oficina             : [this.entidad.oficina],
            telefono            : [telefono],
            emailAsesor         : [email, [Validators.email]],
            nombreCliente       : [nombreCliente],
            telefonoCliente     : [telefonoCliente],
            emailCliente        : [emailCliente, [Validators.email]],
            autorizaPublicidad  : [this.entidad.autorizaPublicidad],
            cirugia             : [this.entidad.cirugia],
            embarazo            : [this.entidad.embarazo],
            otro                : [this.entidad.otro],
            destino             : [this.entidad.destino],
            tipoCotizacion      : [this.entidad.tipoCotizacion],
            hoteles             : this._formBuilder.array([])
        });

      this.hotelesFormArray = this.entidadForm.get('hoteles') as FormArray;
      this.iniHotelesFormArray();
    }

    private iniHotelesFormArray(): void {
        this.entidad.hoteles.forEach(f => {
            this.hotelesFormArray.push(this.insertHotelesFormArray(f));
        });
    }

    private insertHotelesFormArray(hoteles: HotelesDoc): FormGroup {
        return this._formBuilder.group({
            hotel: hoteles.hotel || null,
            nombre: hoteles.nombre || null,
            categoria: hoteles.categoria || null,
            fechaIn: hoteles.fechaIn || null,
            fechaOut: hoteles.fechaOut || null,
            descripcion: hoteles.descripcion || null,
            img: hoteles.img || null,
            habitacion: hoteles.habitacion || null,
            tipoAlimentacion: hoteles.tipoAlimentacion || null,
            servicios: hoteles.servicios || null,
            noServicios: hoteles.noServicios || null,
            penalidades: hoteles.penalidades || null,
        });
    }

    createHotelesFormArray(hotel: Hotel): FormGroup {
        return this._formBuilder.group({
            hotel: hotel,
            nombre: hotel.nombre,
            categoria: hotel.categoria,
            fechaIn: new Date(),
            fechaOut: null,
            descripcion: hotel.descripcion,
            img: hotel.imagenes,
            habitacion: null,
            tipoAlimentacion: hotel.regimenAlimentacion,
            servicios: hotel.servicios,
            noServicios: hotel.serviciosNoIncluidos,
            penalidades: hotel.penalidades,
        });
    }

    addHotelesFormArray(hotel: Hotel): void {
        this.hotelesFormArray.push(this.createHotelesFormArray(hotel));
    }

    removeHotelesFormArray(index): void {
        this.hotelesFormArray.removeAt(index);
    }

    updateHoteles(): void {
        const hotId = this.hotelesForm.get('hotel').value;
        if ( !hotId )
        {
            return;
        }
        const hots = [...this.entidadForm.get('hoteles').value, this.hoteles.find(h => h._id === hotId)];
        if (!Utilities.objects.areEquals(this.entidad.hoteles, hots)) {
            this.entidadForm.get('hoteles').markAsDirty();
        } else {
            // todo
        }
        this.entidadForm.controls['hoteles'].setValue(hots);
        this.hotelesForm.reset();
    }

    getHoteles(): Hotel[] {
        const hots = this.entidadForm.get('hoteles').value;
        return this.hoteles.filter( h =>
            !Utilities.arrays.findPropObjectInArray(hots, '_id', h._id)
        );
    }

}
