import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class OrderItem extends Document {
  @Prop()
  itemId: string;

  @Prop()
  price: number;
}

@Schema()
export class Order extends Document {
  @Prop()
  uuid: string;

  @Prop()
  items: OrderItem[];
  
  @Prop()
  createdDate: Date;
  
  @Prop()
  createdBy: string;
  
  @Prop()
  createdById: string;
  
  @Prop({
    enum: ['CREATED', 'CONFIRMED', 'DELIVERED', 'CANCELLED']
  })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);