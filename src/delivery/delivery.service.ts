import { Injectable } from '@nestjs/common';
import { delay } from 'src/helpers/timer';

@Injectable()
export class DeliveryService {
  async create(orderId: String): Promise<Boolean> {
    await delay(5000);
    return true;
  }
}
