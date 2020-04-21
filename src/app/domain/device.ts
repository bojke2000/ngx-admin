export interface UserCard {
  id?: number;
  customerId: string;
  regNr: string;
  regNrSuffix: string;
  customerName: string;
  address: string;
  addressNo: string;
  addressNo2: string;

  deviceId: string;
  gsmId: number;
  wmbusId?: number;
  medium?: string;

  route: string;
  gsmLongitude: string;
  gsmLatitude: string;

  customerRemarks: string;
  siteRemarks: string;
  routeRemarks: string;
  adogsmRemarks: string;

  variance: number;
  registera: string;
  registerb: string;
  registerc: string;
  registerd: string;
  unita: string;
  unitb: string;
  unitc: string;
  unitd: string;
  multipliera: number;
  multiplierb: number;
  multiplierc: number;
  multiplierd: number;
}

