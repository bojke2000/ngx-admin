export interface Device {
  id?: number;
  siteId: string;
  siteNo: string;
  gsmId: number;
  deviceId: string;
  mpn: string;
  countryId: number;
  cityId: number;
  street: string;
  streetNo: string;
  deviation: number;
  customerName: string;
  customerInfo: string;
  siteRemark: string;
  meterLocationRemark: string;
  nameA: string;
  nameB: string;
  nameC: string;
  nameD: string;
  unitA: string;
  unitB: string;
  unitC: string;
  unitD: string;
  multiplierA: number;
  multiplierB: number;
  multiplierC: number;
  multiplierD: number;
}

