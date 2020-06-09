import { Status } from '../status/status.enum'

export interface Order {
  id: string;
  details: { [key: string]: string };
  createdDate: Date;
  createdBy: string;
  createdById: string;
  status: Status
}