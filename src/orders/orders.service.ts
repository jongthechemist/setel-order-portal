import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Orders } from './orders.schema';
import { Order } from '../order/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async findAll(): Promise<Orders> {
    const orders = await this.orderModel.find()
    return orders;
  }
}
