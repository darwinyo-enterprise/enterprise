import { OnInit, Component } from "@angular/core";
import { Manufacturer, ManufacturerService } from "@enterprise/commerce/catalog-lib";

@Component({
  selector: 'eca-add-manufacturer',
  templateUrl: './add-manufacturer.component.html',
  styleUrls: ['./add-manufacturer.component.scss']
})
export class AddManufacturerComponent implements OnInit {
  
  title: string;
  manufacturer: Manufacturer;

  constructor(
    private manufacturerService: ManufacturerService
  ) {
    this.title = 'Add New Manufacturer';
    this.manufacturer = <Manufacturer>{};
  }

  ngOnInit() {}

}
