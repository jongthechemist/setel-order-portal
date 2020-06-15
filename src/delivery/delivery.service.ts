import { Injectable, Logger } from '@nestjs/common';
import { delay } from '../helpers/timer';

@Injectable()
export class DeliveryService {
  async create(orderId: string): Promise<boolean> {
    Logger.log(orderId, 'DeliveryService');
    await delay(5000);
    return true;
  }
}
