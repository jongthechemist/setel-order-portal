import { OrderStatus } from 'src/status/status.enum';


export interface CreateOrderDto {
  items: { itemId: String, price: Number }[];
  createdDate: Date;
  createdBy: String;
  createdById: String;
}
export interface OrderDto extends CreateOrderDto {
  uuid: String;
  status: OrderStatus;
}
export class OrderStatusDto {
  status: String;
}

