import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentResponseDto, PaymentRequestDto } from './payment.dto';
import {
  Transport,
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

  async create(orderId: string, token?: string): Promise<PaymentResponseDto> {
    Logger.log('calling payment service', 'PaymentService')
    const response = await this.client
      .send<PaymentResponseDto, PaymentRequestDto>(
        { cmd: 'create' },
        {
          secret: this.configService.get<string>('PAYMENT_SECRET'),
          token: token,
          data: orderId,
        },
      )
      .toPromise();
    Logger.log('success calling payment service', 'PaymentService')
    return response;
  }
}
