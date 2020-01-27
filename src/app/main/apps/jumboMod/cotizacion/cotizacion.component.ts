import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CotizacionService} from './cotizacion.service';
import {FuseProgressBarService} from '@fuse/components/progress-bar/progress-bar.service';
import {CotizacionesConst} from './cotizacion.const';
import {CotizacionesModel, CotizacionModel, HotelDoc} from './cotizacion.model';
import {Cotizacion, FileSys, Habitacion, Hotel, HotelesDoc, Moneda} from '@configs/interfaces';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {fuseAnimations} from '@fuse/animations';
import {Utilities} from '@utilities/utilities';
import {EntidadFuntionsService} from '@service/entidad-funtions.service';

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
    hotelesSelect: HotelesDoc[];
    hotelesForm: FormGroup;
    hotelesFormArray: FormArray;
    habitacionesForm = {};
    serviciosForm: FormGroup;
    monedas: Moneda[];
    asesor: any;
    contact: any;
    actualHotel = null;
    habitacionesHoteles = {};
    private _unsubscribeAll: Subject<any>;

  constructor(
      private route: ActivatedRoute,
      private entidadService: CotizacionService,
      private _formBuilder: FormBuilder,
      private _fuseProgressBarService: FuseProgressBarService,
      private entidadFuntionsService: EntidadFuntionsService,
  ) {
      // this.entidad = new CotizacionModel();
      this._unsubscribeAll = new Subject();
  }

  async ngOnInit(): Promise<void> {
      this.id = this.route.snapshot.params.id;
      this.status = this.route.snapshot.params.status;
      this.monedas = this.entidadService.monedas;
      const hotelesGet = await this.entidadService.getHoteles();
      this.hotelesSelect = hotelesGet.map(h => new HotelDoc(h));
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
            hotel: [
                {
                    value: '',
                    disabled: this.entidadForm && this.entidadForm.get('hoteles').value.length >= 3},
                Validators.required
            ]
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
        this.entidad.hoteles.forEach(async f => {
            this.hotelesFormArray.push(await this.insertHotelesFormArray(f));
        });
    }

    async getHotelInfo(hotelDoc: HotelDoc): Promise<HotelDoc> {
      const hotel: Hotel =  await this.entidadService.getHotel(hotelDoc.idHotel);
      this.habitacionesHoteles[hotelDoc.idHotel] = hotel.habitaciones;
      hotelDoc.noServicios = hotel.serviciosNoIncluidos;
      hotelDoc.hotel = hotel;
      hotelDoc.img = hotel.imagenes;
      hotelDoc.penalidades = hotel.penalidades;
      hotelDoc.servicios = hotel.servicios;
      hotelDoc.tipoAlimentacion = hotel.regimenAlimentacion;
      return hotelDoc;
    }

    private async insertHotelesFormArray(hoteles: HotelesDoc): Promise<FormGroup> {
      return this._formBuilder.group(await this.getHotelInfo(hoteles));
    }

    private async createHotelesFormArray(hoteles: HotelesDoc = this.actualHotel): Promise<FormGroup> {
        this.actualHotel = null;
        this.habitacionesForm[hoteles.idHotel] = this._formBuilder.group({
            habitacion: ['']
        });
        hoteles = await this.getHotelInfo(hoteles);
        return this._formBuilder.group({
            idHotel             : [hoteles.idHotel || null],
            hotel               : [hoteles.hotel || null],
            nombre              : [hoteles.nombre || null],
            categoria           : [hoteles.categoria || null],
            fechaIn             : [hoteles.fechaIn || null],
            fechaOut            : [hoteles.fechaOut || null],
            descripcion         : [hoteles.descripcion || null],
            img                 : [hoteles.img || null],
            habitacion          : [hoteles.habitacion || null],
            tipoAlimentacion    : [hoteles.tipoAlimentacion || null],
            servicios           : [hoteles.servicios || null],
            noServicios         : [hoteles.noServicios || null],
            penalidades         : [hoteles.penalidades || null],
        });
    }

    private async addHotelesFormArray(): Promise<void> { // hoteles: HotelesDoc
        this.hotelesFormArray.push(await this.createHotelesFormArray());
        if (this.entidadForm.get('hoteles').value.length >= 3) {
            this.hotelesForm.controls['hotel'].disable();
        }
    }

    async updateHoteles(): Promise<void> {
        const hotId = this.hotelesForm.get('hotel').value;
        if ( !hotId )
        {
            return;
        }
        // const hots = [...this.entidadForm.get('hoteles').value, this.hoteles.find(h => h.idHotel === hotId)];
        this.actualHotel = this.hotelesSelect.find(h => h.idHotel === hotId);
        await this.addHotelesFormArray();
        if (!Utilities.objects.areEquals(this.entidad.hoteles, this.entidadForm.get('hoteles').value)) {
            this.entidadForm.get('hoteles').markAsDirty();
        } else {
            // todo
        }
        this.hotelesForm.reset();
    }

    getHoteles(): HotelesDoc[] {
        const hots = this.entidadForm.get('hoteles').value;
        const newHoteles = this.hotelesSelect.filter( h => hots.every(hh => hh.idHotel !== h.idHotel));
        return  Utilities.arrays.sortAsc(newHoteles, 'nombre');
        // return this.hotelesSelect;
        // !Utilities.arrays.findPropObjectInArray(hots, 'idHotel', h.idHotel)
    }

    removeHotel(index): void {
        this.hotelesFormArray.removeAt(index);
        if (this.entidadForm.get('hoteles').value.length < 3) {
            this.hotelesForm.controls['hotel'].enable();
        }
    }

    updateHabitaciones(id: string, control: FormGroup): void {
      if (!this.habitacionesForm[id]) {
          return;
      }
      const habId = this.habitacionesForm[id].get('habitacion').value;
      if ( !habId )
        {
            return;
        }
      const habs = [...control.get('habitacion').value, this.habitacionesHoteles[id].find(h => h._id === habId)];
      if (this.entidad.hoteles.length > 0 && !Utilities.objects.areEquals((this.entidad.hoteles.find(h => h.idHotel === id)).habitacion, habs)) {
            this.entidadForm.markAsDirty();
        } else {
            // todo
        }
      control.controls.habitacion.setValue(habs);
      this.habitacionesForm[id].reset();
    }

    getHabitaciones(id: string, control: FormGroup): Habitacion[] {
        const habs = control.get('habitacion').value;
        return this.habitacionesHoteles[id].filter( h =>
            !Utilities.arrays.findPropObjectInArray(habs, '_id', h._id)
        );
    }

    /*getSelectedHabitaciones(): Habitacion[] {
        return this.entidadForm.get('habitaciones').value;
    }*/

    eliminarHab(id: string, control: FormGroup): void {
        const habs = [...control.get('habitacion').value].filter(h => h._id !== id);
        control.controls.habitacion.setValue(habs);
    }

}
