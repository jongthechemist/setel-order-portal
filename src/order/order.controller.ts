import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { generateRandomOrder } from './order.mock';
import { Order } from './order.model';
import { generateId } from 'src/helpers/generate-id';

@Controller('order')
export class OrderController {

  @Post()
  async createOrder(@Body() order: Order): Promise<Order> {
    order.id = generateId();
    let createdOrder = await this.saveOrderToDB(order);
    return createdOrder
  }

  @Get(':id')
  async getOrder(@Param('id') orderId): Promise<Order> {
    let order = await this.getOrderFromDB(orderId);
    return order
  }

  @Patch(':id')
  async updateOrder(@Param('id') orderId, @Body() newValues): Promise<Order> {
    let order = await this.updateOrderInDB(orderId, newValues);
    return order
  }

  async saveOrderToDB(order: Order): Promise<Order> {
    return new Promise<Order>((resolve) => {
      resolve(order);
    })
  }

  async getOrderFromDB(orderId: string): Promise<Order> {
    return new Promise<Order>((resolve) => {
      resolve(generateRandomOrder(orderId));
    })
  }
  
  async updateOrderInDB(orderId: string, newValues: Order): Promise<Order> {
    return new Promise<Order>((resolve) => {
      let order = generateRandomOrder(orderId);
      Object.assign(order, newValues);
      resolve(order);
    })
  }
}
