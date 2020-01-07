import { Component, OnInit } from '@angular/core';
import { CarService } from '../../service/carservice';
import { Car } from '../../domain/car';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  cars: Car[];

  cols: any[];

  constructor(private carService: CarService) { }

  ngOnInit(): void {
    this.carService.getCarsSmall().then(cars => this.cars = cars);

        this.cols = [
            { field: 'vin', header: 'Vin' },
            {field: 'year', header: 'Year' },
            { field: 'brand', header: 'Brand' },
            { field: 'color', header: 'Color' }
        ];
  }
}
