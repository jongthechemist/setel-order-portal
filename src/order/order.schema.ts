import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  items: [OrderItem];
  
  @Prop()
  createdDate: Date;
  
  @Prop()
  createdBy: String;
  
  @Prop()
  createdById: String;
  
  @Prop({
    enum: ['CREATED', 'CONFIRMED', 'DELIVERED', 'CANCELLED']
  })
  status: String;
}

export const OrderSchema = SchemaFactory.createForClass(Order);