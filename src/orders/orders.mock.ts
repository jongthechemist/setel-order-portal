import { Status } from 'src/status/status.enum';

export const SAMPLE = [
  { id: '1', details: {}, createdDate: new Date(), createdBy: 'John', createdById: '1', status: Status.Created },
  { id: '2', details: {}, createdDate: new Date(), createdBy: 'Harry', createdById: '2', status: Status.Cancelled },
  { id: '3', details: {}, createdDate: new Date(), createdBy: 'Keith', createdById: '3', status: Status.Confirmed }
]