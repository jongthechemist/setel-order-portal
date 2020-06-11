import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentResponseDto, PaymentRequestDto } from './payment.dto';
import {
  Transport,
  ClientProxy,
  ClientProxyFactory,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentService {
  client: {
    send<TResult, TInput>(pattern: any, data: any): Observable<TResult>;
  };

  constructor(private readonly configService: ConfigService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: configService.get<string>('PAYMENT_HOST'),
        port: configService.get<number>('PAYMENT_PORT'),
      },
    });
  }

  async create(orderId: String, token?: String): Promise<PaymentResponseDto> {
    let response = await this.client
      .send<PaymentResponseDto, PaymentRequestDto>(
        { cmd: 'create' },
        {
          secret: this.configService.get<string>('PAYMENT_SECRET'),
          token: token,
          data: orderId,
        },
      )
      .toPromise();
    return response;
  }
}
