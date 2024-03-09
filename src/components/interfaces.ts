export interface Employee {
  id: number;
  employeeCode: string;
  email: string;
  password: string;
  fullname: string;
  address: string;
  province: string;
  district: string;
  postalCode: string;
  phoneNumber: string;
  avatar: string;
  submitedInfo: any | null;
  branchId: number;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  status: number;
  branch: any;
  role: any | null;
  historyLogs: any[];
  blogs: any | null;
  supportTickets: any | null;
}

interface User {
  id: number;
  fullname: string;
  email: string;
  password: string;
  phone: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string | null;
  status: number;
  refreshToken: string | null;
  refreshTokenExpires: string | null;
  passwordResetToken: string | null;
  resetTokenExpires: string | null;
  customers: any[];
  packages: any[];
  supportTickets: any | null;
}

export interface Branch {
  id: number;
  branchName: string;
  phoneNumber: string;
  address: string;
  createdAt: string;
  district: string;
  employees: any[]; // Replace with appropriate type
  postalCode: string;
  province: string;
  status: number;
  updatedAt: string;
}
export interface HistoryLog {
  id: number;
  packageId: number;
  employeeId: number;
  step: number;
  historyNote: string;
  photos: string;
  processStep: number;
  employeeIdNextStep: number;
  createdAt: string;
  updatedAt: string;
  status: number;
  package: any | null;
  employee: Employee;
  employeeNextStep: Employee | null;
}

export interface Item {
  id: number;
  packageId: number;
  itemName: string;
  itemWeight: number;
  itemQuantity: number;
  itemType: number;
  itemValue: number;
  createdAt: string;
  package: any; // Replace with appropriate type
  status: number;
  updatedAt: string;
}

export interface Service {
  id: number;
  serviceTypeId: number;
  weighFrom: number;
  weighTo: number;
  createdAt: string;
  updatedAt: string;
  status: number;
  serviceType: ServiceType;
}

export interface ServiceType {
  id: number;
  serviceName: string;
  serviceDescription: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  services: any[];
}

export interface Data {
  id: number;
  trackingCode: string;
  nameFrom: string;
  addressFrom: string;
  addressTo: string;
  createdAt: string;
  historyLogs: HistoryLog[];
  items: Item[];
  nameTo: string;
  packageNote: string;
  packageSize: string | null;
  packageType: number;
  postalCodeFrom: string;
  phoneFrom: string;
  postalCodeTo: string;
  service: Service;
  timeProcess: number;
  serviceId: number;
  status: number;
  step: number;
  totalFee: number;
  updatedAt: string;
  user: any;
  userId: number;
}

export interface TrackingDataItem {
  id: number;
  service: Service;
  feeCharge: number;
  timeProcess: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  serviceName: string;
}

export interface TrackingData {
  id: number;
  trackingCode: string;
  nameFrom: string;
  addressFrom: string;
  postalCodeFrom: string;
  phoneFrom: string;
  nameTo: string;
  addressTo: string;
  postalCodeTo: string;
  phoneTo: string;
  packageType: number;
  packageSize: any | null;
  packageNote: string;
  totalFee: number;
  cod: any | null;
  feeCustomId: number;
  userId: number;
  step: number;
  createdAt: string;
  updatedAt: string;
  status: number;
  user: User;
  feeCustom: FeeCustom;
  items: Item[];
  historyLogs: HistoryLog[];
}

interface FeeCustom {
  id: number;
  serviceId: number;
  locationIdFrom: number;
  locationIdTo: number;
  overWeightCharge: number;
  feeCharge: number;
  timeProcess: number;
  createdAt: string;
  updatedAt: string;
  status: number;
  service: Service;
  locationFrom: any | null;
  locationTo: any | null;
}

export interface Value {
  id: number;
  trackingCode: string;
  nameFrom: string;
  addressFrom: string;
  postalCodeFrom: string;
  nameTo: string;
  addressTo: string;
  postalCodeTo: string;
  packageSize: null;
  packageNote: string;
  totalFee: number;
  serviceId: number;
  userId: number;
  step: number;
  createdAt: string;
  updatedAt: string;
  status: number;
  user: null;
  service: Service;
  items: Item[];
  historyLogs: HistoryLog[];
}
export interface BlogItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  author: string;
  category: number;
  employeeId: number;
  createdAt: string;
  updatedAt: string;
  status: number;
  employee: Employee;
}

export interface SiteSetting {
  id: number;
  settingName: string;
  settingValue: string;
  status: number;
}

export interface SiteContextType {
  siteSetting: SiteSetting[];
}