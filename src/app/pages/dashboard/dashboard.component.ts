import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../service/deviceservice';
import { Device } from '../../domain/device';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.css'],

})
export class DashboardComponent implements OnInit {

  devices: Device[];
  cols: any[];
  isLoading: boolean;
  isResisable: boolean = true;

  constructor(private deviceService: DeviceService) { }

  ngOnInit(): void {
    this.deviceService.getDevices().then(devices => this.devices = devices) ;

        this.cols = [
          { field: 'id', header: 'id', width: '1%' },
          { field: 'siteId', header: 'siteId' , width: '3%' },
          { field: 'siteNo', header: 'siteNo' , width: '3%' },
          { field: 'gsmId', header: 'gsmId' , width: '3%' },
          { field: 'deviceId', header: 'deviceId' , width: '3%' },
          { field: 'mpn', header: 'mpn' , width: '3%' },
          { field: 'countryId', header: 'countryId' , width: '1%' },
          { field: 'cityId', header: 'cityId' , width: '1%' },
          { field: 'street', header: 'street' , width: '10%' },
          { field: 'streetNo', header: 'streetNo' , width: '2%' },
          { field: 'deviation', header: 'deviation' , width: '1%' },
          { field: 'customerName', header: 'customerName' , width: '10%' },
          { field: 'customerInfo', header: 'customerInfo' , width: '10%' },
          { field: 'siteRemark', header: 'siteRemark' , width: '5%' },
          { field: 'meterLocationRemark', header: 'meterLocationRemark' , width: '2%' },
          { field: 'nameA', header: 'nameA' , width: '3%' },
          { field: 'nameB', header: 'nameB' , width: '3%' },
          { field: 'nameC', header: 'nameC' , width: '3%' },
          { field: 'nameD', header: 'nameD' , width: '3%' },
          { field: 'unitA', header: 'unitA' , width: '1%' },
          { field: 'unitB', header: 'unitB' , width: '1%' },
          { field: 'unitC', header: 'unitC' , width: '1%' },
          { field: 'unitD', header: 'unitD' , width: '1%' },
          { field: 'multiplierA', header: 'multiplierA' , width: '3%' },
          { field: 'multiplierB', header: 'multiplierB' , width: '3%' },
          { field: 'multiplierC', header: 'multiplierC' , width: '3%' },
          { field: 'multiplierD', header: 'multiplierD' , width: '3%' },
        ];
  }

  resettable() {
    this.isLoading = true;
    this.devices = [...this.devices];
    // this.dataTable.reset();
    setTimeout( () => {
      this.isLoading = false;
    }, 3);
  }
}
