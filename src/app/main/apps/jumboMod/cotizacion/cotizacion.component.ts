import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.scss']
})
export class CotizacionComponent implements OnInit {
    id: string;
    status: string;
    cotizacionForm: FormGroup;

  constructor(
      private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
      this.id = this.route.snapshot.params.id;
      this.status = this.route.snapshot.params.status;
  }

}
