import { PollingResponse, PollingRequest } from '../polling/polling.interface';

export type OrderResponse<T> = PollingResponse<T>

export type OrderRequest = PollingRequest
