import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractComponent } from '../AbstractComponent';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api';
import { UserCardService } from '../service/user-card.service';
import { AddressService } from '../service/address.service';
import { Option } from '../domain/option';
import { UserCard } from '../domain/user-card';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-zone-device-assign',
  templateUrl: './zone-device-assign.component.html',
  styleUrls: ['./zone-device-assign.component.scss']
})
export class ZoneDeviceAssignComponent extends AbstractComponent implements OnInit, AfterViewInit {
  availableItems = [];//Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}`, selected: false }));
  assignedItems = [];
  filterTextAvailable = '';
  filterTextAssigned = '';

  pageSize = 17; // Number of items per page
  currentPageAvailable = 1;
  currentPageAssigned = 1;
  totalPagesAvailable = 0;
  totalPagesAssigned = 0;
  zoneDevices: Option[] = [];
  addresses: Option[] = [];
  zoneDevice: Option;
  address: Option;

  constructor(translate: TranslateService,
    private userCardService: UserCardService,
    private cdr: ChangeDetectorRef,
    private addressService: AddressService) {
    super(translate);
  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  async ngOnInit() {
    // Calculate total pages for available and assigned items
    this.calcTotalPagesAvailable();
    await this.loadZoneDevices();
    await this.loadDevicesByAddress();
  }
  private calcTotalPagesAvailable() {
    this.totalPagesAvailable = Math.ceil(this.availableItems.length / this.pageSize);
    this.totalPagesAssigned = Math.ceil(this.assignedItems.length / this.pageSize);
  }

  onAddressChange(event$) {
    const address: Option = event$.value;
    this.loadDevicesByAddress(address);
  }

  onZoneDeviceChange(event$) {
    this.loadDevicesByAddress();
  }

  saveAssignements() {
    const updateAssigned = this.assignedItems.filter(item => item.parentId !== this.zoneDevice.value);
    const updateAvailable = this.availableItems.filter(item => item.parentId === this.zoneDevice.value).map(item => {
      item.parentUd = undefined;
      return item
    });

    const self = this;
    updateAssigned.forEach(item => {
      const uc = new UserCard();
      uc.id = item.id;
      uc.parentId = Number(this.zoneDevice.value);
      self.userCardService.updateParentId(uc).subscribe((val) => {
        console.log(val);
      });
    });

    updateAvailable.forEach(item => {
      const uc = new UserCard();
      uc.id = item.id;
      uc.parentId = undefined;
      self.userCardService.updateParentId(uc)
        .subscribe((val) => {
          console.log(val);
        });
    });
  }

  async loadDevicesByAddress(address?: Option) {
    this.addressService.getAddresssAsOptions().then(addresses => {
      this.addresses = addresses;
      this.address = address ? address : addresses && addresses.length > 0 ? addresses[0] : undefined;
      let criteria: any = {};
      if (this.address) {
        criteria.address = this.address.value;
      }
      this.assignedItems = [];
      this.availableItems = [];
      this.userCardService.findBy(criteria).then((response: any) => {
        response.data.forEach(item => {
          if (item.id !== this.zoneDevice.value) {
            if (item.parentId === this.zoneDevice.value) {
              this.assignedItems.push({ 'id': item.id, 'name': item.customerName, selected: false, 'parentId': item.parentId });
            } else {
              this.availableItems.push({ 'id': item.id, 'name': item.customerName, selected: false, 'parentId': item.parentId });
            }
          }
        });
        this.calcTotalPagesAvailable();
      });
    });
  }

  private async loadZoneDevices() {
    const criteria = {};
    this.zoneDevices = [];
    criteria['deviceType'] = 1;
    this.userCardService.findBy(criteria, {}).then((ngresp: any) => {
      ngresp.data.forEach(item => this.zoneDevices.push({ 'label': item.customerName, 'value': item.id }));
      this.zoneDevice = this.zoneDevices && this.zoneDevices.length > 0 ? this.zoneDevices[0] : undefined;
    });

  }

  get filteredAvailableItems(): any[] {
    const startIndex = (this.currentPageAvailable - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.availableItems.slice(startIndex, endIndex).filter(item =>
      item.name.toLowerCase().includes(this.filterTextAvailable.toLowerCase())
    );
  }

  get filteredAssignedItems(): any[] {
    const startIndex = (this.currentPageAssigned - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.assignedItems.slice(startIndex, endIndex).filter(item =>
      item.name.toLowerCase().includes(this.filterTextAssigned.toLowerCase())
    );
  }

  assignSelected() {
    const selectedItems = this.filteredAvailableItems.filter(item => item.selected);
    this.assignedItems = [...this.assignedItems, ...selectedItems];

    // Remove selected items from the available items list
    this.availableItems = this.availableItems.filter(item => !selectedItems.includes(item));

    // Recalculate total pages for available and assigned items
    this.totalPagesAvailable = Math.ceil(this.availableItems.length / this.pageSize);
    this.totalPagesAssigned = Math.ceil(this.assignedItems.length / this.pageSize);

    // Clear selection after moving items
    selectedItems.forEach(item => (item.selected = false));

    // Sort the remaining available items
    this.availableItems = this.sortItemsByName(this.availableItems);

    // Sort the assigned items
    this.assignedItems = this.sortItemsByName(this.assignedItems);


    // Recalculate total pages for available and assigned items
    this.totalPagesAvailable = Math.ceil(this.availableItems.length / this.pageSize);
    this.totalPagesAssigned = Math.ceil(this.assignedItems.length / this.pageSize);

    // Adjust current page if necessary
    if (this.currentPageAvailable > this.totalPagesAvailable) {
      this.currentPageAvailable = this.totalPagesAvailable;
    }
  }

  removeSelected() {
    const selected = this.filteredAssignedItems.filter(item => item.selected);
    this.availableItems = [...this.availableItems, ...selected];
    this.assignedItems = this.assignedItems.filter(item => !selected.includes(item));
    // Clear selection after moving items
    selected.forEach(item => (item.selected = false));
    // Recalculate total pages for assigned items after update

    // Sort the available items
    this.availableItems = this.sortItemsByName(this.availableItems);

    // Sort the assigned items
    this.assignedItems = this.sortItemsByName(this.assignedItems);

    // Recalculate total pages for available and assigned items
    this.totalPagesAvailable = Math.ceil(this.availableItems.length / this.pageSize);
    this.totalPagesAssigned = Math.ceil(this.assignedItems.length / this.pageSize);

    // Adjust current page if necessary
    if (this.currentPageAvailable > this.totalPagesAvailable) {
      this.currentPageAvailable = this.totalPagesAvailable;
    }
  }

  assignAll() {
    // Get all remaining items on the current page
    const remainingItemsOnPage = this.availableItems.slice((this.currentPageAvailable - 1) * this.pageSize);
    this.assignedItems = [...this.assignedItems, ...remainingItemsOnPage];
    this.availableItems = this.availableItems.filter(item => !remainingItemsOnPage.includes(item));

    // Update total pages for both lists after assigning all
    this.totalPagesAvailable = Math.ceil(this.availableItems.length / this.pageSize);
    this.totalPagesAssigned = Math.ceil(this.assignedItems.length / this.pageSize);


    // Sort the remaining available items
    this.availableItems = this.sortItemsByName(this.availableItems);

    // Sort the assigned items
    this.assignedItems = this.sortItemsByName(this.assignedItems);


    // Update total pages for both lists after assigning all
    this.totalPagesAvailable = 0;
    this.totalPagesAssigned = Math.ceil(this.assignedItems.length / this.pageSize);
    this.currentPageAvailable = 1; // Reset the current page for available items

  }

  toggleSelectAll(items: any[], checked: boolean) {
    items.forEach(item => (item.selected = checked));
  }

  removeAll() {
    this.availableItems = [...this.availableItems, ...this.assignedItems];
    this.assignedItems = [];
    // Update total pages for both lists after removing all
    this.totalPagesAvailable = Math.ceil(this.availableItems.length / this.pageSize);
    this.totalPagesAssigned = 0;

    // Sort the available items
    this.availableItems = this.sortItemsByName(this.availableItems);


    // Update total pages for both lists after removing all
    this.totalPagesAvailable = Math.ceil(this.availableItems.length / this.pageSize);
    this.totalPagesAssigned = 0;
    this.currentPageAvailable = 1; // Reset the current page for available items

  }

  previousPageAvailable() {
    if (this.currentPageAvailable > 1) {
      this.currentPageAvailable--;
    }
  }

  nextPageAvailable() {
    if (this.currentPageAvailable < this.totalPagesAvailable) {
      this.currentPageAvailable++;
    }
  }

  previousPageAssigned() {
    if (this.currentPageAssigned > 1) {
      this.currentPageAssigned--;
    }
  }

  nextPageAssigned() {
    if (this.currentPageAssigned < this.totalPagesAssigned) {
      this.currentPageAssigned++;
    }
  }

  sortItemsByName(items: any[]): any[] {
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }
}