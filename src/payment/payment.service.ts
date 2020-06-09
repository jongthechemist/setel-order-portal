import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentResponseDto } from './payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async create(orderId: String): Promise<PaymentResponseDto> {
    let response = null;
    const paymentUrl = this.configService.get<string>('PAYMENT_URL');

    if (paymentUrl) {
      response = await this.httpService.post<PaymentResponseDto>(paymentUrl, {orderId}, {
        auth: {
          username: '',
          password: ''
        }
      })
    } else {
      throw new Error('Missing environment variable.');
    }

    return response;
  }
}
