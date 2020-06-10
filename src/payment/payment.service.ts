import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentResponseDto } from './payment.dto';
import {
  Transport,
  ClientProxy,
  ClientProxyFactory,
} from '@nestjs/microservices';

@Injectable()
export class PaymentService {
  private _client: ClientProxy;

  constructor(private readonly configService: ConfigService) {
    this._client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: configService.get<string>('PAYMENT_HOST'),
        port: configService.get<number>('PAYMENT_PORT'),
      },
    });
  }

  async create(orderId: String): Promise<PaymentResponseDto> {
    let response = await this._client
      .send<PaymentResponseDto, String>({ cmd: 'create' }, orderId)
      .toPromise();
    return response;
  }
}
