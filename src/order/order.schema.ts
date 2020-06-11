import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OrderStatus } from 'src/status/status.enum';

@Schema()
class OrderItem extends Document {
  @Prop()
  itemId: String;

  @Prop()
  price: Number;
}

@Schema()
export class Order extends Document {
  @Prop()
  uuid: String;

  @Prop()
  items: OrderItem[];
  
  @Prop()
  createdDate: Date;
  
  @Prop()
  createdBy: String;
  
  @Prop()
  createdById: String;
  
  @Prop({
    enum: ['CREATED', 'CONFIRMED', 'DELIVERED', 'CANCELLED']
  })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);