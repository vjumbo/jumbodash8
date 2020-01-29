import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
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
import {MatSnackBar} from '@angular/material';
import {Location} from '@angular/common';

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
    reload = `/apps/jumbomod/cotizacion/`;
    totalMonedaControl: FormControl;
    private _unsubscribeAll: Subject<any>;

  constructor(
      private route: ActivatedRoute,
      private entidadService: CotizacionService,
      private _formBuilder: FormBuilder,
      private _fuseProgressBarService: FuseProgressBarService,
      private entidadFuntionsService: EntidadFuntionsService,
      private _matSnackBar: MatSnackBar,
      private _location: Location,
      private cdRef: ChangeDetectorRef,
  ) {
      // this.entidad = new CotizacionModel();
      this._unsubscribeAll = new Subject();
  }

  async ngOnInit(): Promise<void> {
      this.id = this.route.snapshot.params.id;
      this.status = this.route.snapshot.params.status;
      this.reload = `${this.reload}${this.id}/${this.status}`;
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
      this.cdRef.detectChanges();
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
      const monedaID = this.entidad.totalMomenda ? this.entidad.totalMomenda : (this.monedas.find(m => m.defaultid.toString() === '-11')).id;

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
            hoteles             : this._formBuilder.array([]),
            totalHoteles        : [this.entidad.totalHoteles],
            planIncluye         : [this.entidad.planIncluye],
            planNoIncluye       : [this.entidad.planNoIncluye],
            totalMoneda         : [monedaID],
            adult               : [this.entidad.adult],
            adultValor          : [this.entidad.adult],
            adultValorTotal     : [this.entidad.adult],
            chd                 : [this.entidad.chd],
            chdValor            : [this.entidad.chdValor],
            chdValorTotal       : [this.entidad.chdValorTotal],
            inf                 : [this.entidad.chd],
            infValor            : [this.entidad.chdValor],
            infValorTotal       : [this.entidad.chdValorTotal],
        });

      this.totalMonedaControl = new FormControl('totalMonedaControl');
      this.entidadForm.controls.totalHoteles.valueChanges.subscribe(value => {
            this.totalMonedaControl.get('totalMonedaControl').setValue(value, { onlySelf: true, emitEvent: false, emitModelToViewChange: true });
        }, error => {}, () => { });
      this.totalMonedaControl.get('totalMonedaControl').valueChanges.subscribe(value => {
        this.entidadForm.controls.total.get('totalMonedaControl').setValue(value, { onlySelf: true, emitEvent: false, emitModelToViewChange: true });
        }, error => {}, () => { });

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
            // moneda: ['', Validators.required],
            costo: [0, Validators.required],
            cantidad: [0, Validators.required],
            habitacion: ['', Validators.required]
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
            habitaciones        : [hoteles.habitaciones || null],
            totalHotel          : [hoteles.totalHotel || 0],
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

    removeHotel(index, control: FormGroup): void {
        this.hotelesFormArray.removeAt(index);
        if (this.entidadForm.get('hoteles').value.length < 3) {
            this.hotelesForm.controls['hotel'].enable();
        }
        this.entidadForm.controls.totalHoteles.setValue(this.entidadForm.controls.totalHoteles.get('totalHoteles').value - control.get('totalHotel').value);
    }

    updateHabitaciones(id: string, control: FormGroup): void {
      if (!this.habitacionesForm[id]) {
          return;
      }
      const habId = this.habitacionesForm[id].get('habitacion').value;
      const cantidad = this.habitacionesForm[id].get('cantidad').value;
      const costo = this.habitacionesForm[id].get('costo').value;
      const total = cantidad * costo;
      control.controls.totalHotel.setValue(control.get('totalHotel').value + total);
      this.entidadForm.controls.totalHoteles.setValue(this.entidadForm.controls.totalHoteles.get('totalHoteles').value + total);
      if ( !habId )
        {
            return;
        }
      const habs = [...control.get('habitaciones').value, {idHab: habId, cantidad, costo, habitacion: this.habitacionesHoteles[id].find(h => h._id === habId)}];
      if (this.entidad.hoteles.length > 0 && !Utilities.objects.areEquals((this.entidad.hoteles.find(h => h.idHotel === id)).habitaciones, habs)) {
            this.entidadForm.markAsDirty();
        } else {
            // todo
        }
      control.controls.habitaciones.setValue(habs);
      this.habitacionesForm[id].reset();
    }

    getHabitaciones(id: string, control: FormGroup): Habitacion[] {
        const habs = control.get('habitaciones').value;
        return this.habitacionesHoteles[id].filter( h =>
            !Utilities.arrays.findPropObjectInArray(habs, 'idHab', h._id)
        );
    }

    /*getSelectedHabitaciones(): Habitacion[] {
        return this.entidadForm.get('habitaciones').value;
    }*/

    eliminarHab(id: string, control: FormGroup): void {
        const habitaciones = control.get('habitacion').value;
        const habs = [...habitaciones].filter(h => h.idHab !== id);
        const {cantidad, costo} = habitaciones.find(h => h.idHab === id);
        const total = cantidad * costo;
        control.controls.habitacion.setValue(habs);
        control.controls.totalHotel.setValue(control.get('totalHotel').value - total);
        this.entidadForm.controls.totalHoteles.setValue(this.entidadForm.controls.totalHoteles.get('totalHoteles').value - total);
    }

    monedaSimbolo(i): string {
        const moneda = this.habitacionesForm[i].get('moneda').value;
        return this.getMonedaSimbolo(moneda);
    }

    getMonedaSimbolo(moneda): string {
        return moneda && moneda.length > 0 ? this.monedas.find(m => m.id === moneda).currency_symbol
            : this.monedas.find(m => m.defaultid < 0).currency_symbol;
    }

    updateTotals(type: string): void {
        const cantidad = this.entidadForm.get(`${type}`).value ? this.entidadForm.get(`${type}`).value : 0;
        const valor = this.entidadForm.get(`${type}Valor`).value ? this.entidadForm.get(`${type}Valor`).value : 0;
        this.entidadForm.controls[`${type}ValorTotal`].setValue(cantidad * valor);
    }

    setNewData(): any {
        const data = {...this.entidadForm.getRawValue()};
        data.totalMomenda = this.monedas.find(m => m.id === data.totalMomenda);
        return data;
    }

    addEntidad(): void
    {
        const data = this.setNewData();

        this.entidadService.addEntidad(Utilities.systems.setEntitySistema(data))
            .then(() => {

                // Trigger the subscription with new data
                this.entidadService.onEntidadChanged.next(data);

                // Show the success message
                this._matSnackBar.open(`${this.status} Agregado`, 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });

                // Change the location with new one
                this._location.go(this.reload);
            });
    }

    saveEntidad(): void
    {
        const data = this.setNewData();
        this.entidadService.saveEntidad(Utilities.systems.setEntitySistema(data))
            .then(() => {

                // Trigger the subscription with new data
                this.entidadService.onEntidadChanged.next(data);

                // Show the success message
                this._matSnackBar.open(`${this.status} Guardado`, 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });

                // Change the location with new one
                this._location.go(this.reload);
            });
    }

}
