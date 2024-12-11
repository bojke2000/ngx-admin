import { Component, OnInit } from '@angular/core';
import { AbstractComponent } from '../AbstractComponent';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-zone-device-assign',
  templateUrl: './zone-device-assign.component.html',
  styleUrls: ['./zone-device-assign.component.scss']
})
export class ZoneDeviceAssignComponent extends AbstractComponent implements OnInit {
  availableItems = Array.from({ length: 500 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}`, selected: false }));
  assignedItems: any[] = [];
  filterTextAvailable = '';
  filterTextAssigned = '';

  constructor(translate: TranslateService) {
    super(translate);
  }

  ngOnInit(): void {
  }

  get filteredAvailableItems() {
    return this.availableItems.filter(item =>
      item.name.toLowerCase().includes(this.filterTextAvailable.toLowerCase())
    );
  }

  get filteredAssignedItems() {
    return this.assignedItems.filter(item =>
      item.name.toLowerCase().includes(this.filterTextAssigned.toLowerCase())
    );
  }

  assignSelected() {
    const selected = this.filteredAvailableItems.filter(item => item.selected);
    this.assignedItems = [...this.assignedItems, ...selected];
    this.availableItems = this.availableItems.filter(item => !selected.includes(item));
    // Clear selection after moving items
    selected.forEach(item => (item.selected = false));
  }

  removeSelected() {
    const selected = this.filteredAssignedItems.filter(item => item.selected);
    this.availableItems = [...this.availableItems, ...selected];
    this.assignedItems = this.assignedItems.filter(item => !selected.includes(item));
    // Clear selection after moving items
    selected.forEach(item => (item.selected = false));
  }

  assignAll() {
    this.assignedItems = [...this.assignedItems, ...this.availableItems];
    this.availableItems = [];
  }

  toggleSelectAll(items: any[], checked: boolean) {
    items.forEach(item => (item.selected = checked));
  }

  removeAll() {
    this.availableItems = [...this.availableItems, ...this.assignedItems];
    this.assignedItems = [];
  }
}