import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';
import { Observable, of } from 'rxjs';
import { PaymentResponseDto } from './payment.dto';
import { HttpModule, HttpService } from '@nestjs/common';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [PaymentService, ConfigService],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(paymentService).toBeDefined();
  });

  it('should send payment request', async () => {
    const dto: PaymentResponseDto = { orderUuid: 'abcd', status: 'CONFIRMED' };
    const response = {
      data: dto,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    jest.spyOn(httpService, 'post').mockImplementationOnce(
      () => of(response),
    );
    const result = await paymentService.create('abcd');

    expect(result).toBe(dto);
  });
});
