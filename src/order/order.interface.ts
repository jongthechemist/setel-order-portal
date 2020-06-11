import { PollingResponse, PollingRequest } from '../polling/polling.interface';

export interface OrderResponse<T> extends PollingResponse<T> {}

export interface OrderRequest extends PollingRequest {}
