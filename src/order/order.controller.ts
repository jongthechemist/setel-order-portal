import { Controller, Get, Param } from '@nestjs/common';
import { generateRandomOrder } from './order.mock';
import { Order } from './order.model';

@Controller('order')
export class OrderController {

  @Get(':id')
  async getOrder(@Param('id') orderId): Promise<Order> {
    let order = await this.getOrderFromDB(orderId);
    return order
  }

  async getOrderFromDB(orderId: string): Promise<Order> {
    return new Promise<Order>((resolve) => {
      resolve(generateRandomOrder(orderId));
    })
  }
}
