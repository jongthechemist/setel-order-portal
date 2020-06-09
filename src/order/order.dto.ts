import { OrderStatus } from 'src/status/status.enum';

export class CreateOrderDto {
  readonly items: { itemId: String, price: Number }[];
  readonly createdDate: Date;
  readonly createdBy: String;
  readonly createdById: String;
}

export class UpdateOrderDto {
  readonly status: OrderStatus;
}