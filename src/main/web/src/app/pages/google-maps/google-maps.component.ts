import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 40.73061, lng: -73.935242 }; // Example: New York City
  zoom = 12;
  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    // Add other options if needed
  };
  constructor() { }

  ngOnInit(): void {
  }

}
