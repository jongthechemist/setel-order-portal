import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { PaymentResponseDto } from './payment.dto';
import { startWith, map } from 'rxjs/operators';
import { ClientProxyFactory } from '@nestjs/microservices';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let configService = new ConfigService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService, ConfigService],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
    configService = module.get<ConfigService>(ConfigService);

    // jest
    //   .spyOn(ClientProxyFactory, 'create')
    //   .mockImplementation((_options: any) => {
    //     return {  }
    //   });
  });

  it('should be defined', () => {
    expect(paymentService).toBeDefined();
  });

  it('should send payment request', async () => {
    let dto: PaymentResponseDto = { orderUuid: 'abcd', status: 'CONFIRMED' };
    jest
      .spyOn(paymentService.client, 'send')
      .mockImplementation((_pattern: any) => {
        let response = new Observable<PaymentResponseDto>(subscriber => {
          setTimeout(() => {
            subscriber.next(dto);
            subscriber.complete();
          }, 1000);
        });
        return response;
      });
    let response = await paymentService.create('abcd');

    expect(response).toBe(dto);
  });
});
