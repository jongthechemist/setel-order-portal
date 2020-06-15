export interface CreateOrderDto {
  items: { itemId: string, price: number }[];
  createdDate: Date;
  createdBy: string;
  createdById: string;
}
export interface OrderDto extends CreateOrderDto {
  uuid: string;
  status: string;
}
export class OrderStatusDto {
  status: string;
  canPoll: boolean;
}

