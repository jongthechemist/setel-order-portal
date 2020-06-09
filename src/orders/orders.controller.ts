import { Controller, Get } from '@nestjs/common';
import { Orders } from './orders.model';
import { SAMPLE } from './orders.mock';

@Controller('orders')
export class OrdersController {

  @Get()
  async getOrders(): Promise<Orders> {
    let orders = await this.getOrdersFromDB();
    return orders;
  }

  getOrdersFromDB(): Promise<Orders> {
    return new Promise<Orders>((resolve) => {
      resolve(SAMPLE);
    });
  }
}
