import { Injectable, Logger, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentResponseDto, PaymentRequestDto } from './payment.dto';
import { Transport, ClientProxyFactory } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async create(orderUuid: string, token?: string): Promise<PaymentResponseDto> {
    Logger.log('calling payment service', 'PaymentService');
    const url = this.configService.get<string>('PAYMENT_API');
    const auth = this.configService.get<string>('PAYMENT_AUTHORIZATION');
    const response = await this.httpService
      .post(
        `${url}/${orderUuid}`,
        {},
        {
          headers: {
            Authorization: auth || token,
          },
        },
      )
      .toPromise()
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw new Error('Failed to call payment service');
      });
    Logger.log('success calling payment service', 'PaymentService');
    return response;
  }
}
