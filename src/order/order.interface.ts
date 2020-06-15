export interface OrderResponse<T> {
  send(response: T): void;
}

export interface OrderRequest {
  on(event: 'close', callback: () => void): void;
}
