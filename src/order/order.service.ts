import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { generateUuid } from 'src/helpers/uuid';
import { OrderStatus } from 'src/status/status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async create(order: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel(order);
    createdOrder.set('uuid', generateUuid());
    createdOrder.set('status', OrderStatus.Created);
    return createdOrder.save();
  }

  async find(orderUuid: String): Promise<Order> {
    const foundOrder = this.orderModel.findOne({ uuid: orderUuid });
    return foundOrder;
  }

  async update(orderUuid: String, newValues: UpdateOrderDto): Promise<Order> {
    const order = await this.find(orderUuid);
    if (order === null) {
      return null;
    }
    for (let key in newValues) {
      order[key] = newValues[key];
    }
    await order.save({ validateBeforeSave: true });
    return order;
  }
}
