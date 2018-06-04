import { Component, OnInit } from '@angular/core';
import { Manufacturer } from '@enterprise/commerce/catalog-lib';
import { Store, Select } from '@ngxs/store';
import { UpdateManufacturer, ManufacturersMock, FetchSingleManufacturer, ManufacturerState } from '@enterprise/commerce/manufacturer-lib';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({

  selector: 'eca-edit-manufacturer',
  templateUrl: './edit-manufacturer.component.html',
  styleUrls: ['./edit-manufacturer.component.scss']
})
/** TODO: Remove Mock manufacturer */
export class EditManufacturerComponent implements OnInit {
  title: string;
  nameSaveButton: string;
  constructor(private store: Store, private route: ActivatedRoute) {
    this.title = 'Edit Manufacturer';
    this.nameSaveButton = 'Update';
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.store.dispatch(new FetchSingleManufacturer(params.get('id')))
    });
  }
  onManufacturerUpdate(manufacturer: Manufacturer) {
    this.store.dispatch(new UpdateManufacturer(manufacturer));
  }
}
