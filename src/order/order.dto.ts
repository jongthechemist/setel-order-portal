export class CreateOrderDto {
  readonly items: { itemId: String, price: Number }[];
  readonly createdDate: Date;
  readonly createdBy: String;
  readonly createdById: String;
}

export class OrderStatusDto {
  readonly status: String;
}

