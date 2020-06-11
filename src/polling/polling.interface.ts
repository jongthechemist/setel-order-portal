export interface PollingResponse<T> {
  send(response: T): void;
}
export interface PollingRequest {
  on(event: 'close', callback: Function): void;
}