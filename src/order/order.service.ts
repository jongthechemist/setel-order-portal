import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { CreateOrderDto, OrderDto } from './order.dto';
import { generateUuid } from '../helpers/uuid';
import { OrderStatus } from '../status/status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async create(order: CreateOrderDto): Promise<OrderDto> {
    const createdOrder = new this.orderModel(order);
    createdOrder.uuid = generateUuid();
    createdOrder.status = 'CREATED';
    return createdOrder.save({ validateBeforeSave: true });
  }

  async find(orderUuid: String): Promise<OrderDto> {
    const foundOrder = this.orderModel.findOne({ uuid: orderUuid });
    return foundOrder;
  }

  async updateStatus(orderUuid: String, status: OrderStatus): Promise<OrderDto> {
    const order = await this.orderModel.findOne({ uuid: orderUuid });
    if (order === null) {
      return null;
    }
    if (order.status !== 'CANCELLED') {
      order.status = status;
    }
    return order.save({ validateBeforeSave: true });
  }
}
