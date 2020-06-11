import { Test, TestingModule } from '@nestjs/testing';
import { PollingService } from './polling.service';

describe('PollingService', () => {
  let service: PollingService;

  const mockRequest = { on: jest.fn() };
  const mockResponse = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PollingService],
    }).compile();

    service = module.get<PollingService>(PollingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  it('should define subscribers of different topics', () => {
    service.subscribe('abcd', mockRequest, mockResponse);
    service.subscribe('defg', mockRequest, mockResponse);

    expect(service.subscribers.get('abcd')).toBeDefined();
    expect(service.subscribers.get('defg')).toBeDefined();
  });

  it('should add subscription', () => {
    service.subscribe('abcd', mockRequest, mockResponse);
    expect(service.subscribers.get('abcd')).toContain(mockResponse);
  });

  it('should remove subscription on request close', done => {
    expect.assertions(2);

    const mockRequestOn = (event, callback) => {
      setTimeout(() => {
        callback();
        expect(service.subscribers.get('abcd')).not.toContain(mockResponse);
        done();
      }, 1000);
    };

    jest.spyOn(mockRequest, 'on').mockImplementation(mockRequestOn);
    service.subscribe('abcd', mockRequest, mockResponse);
    expect(service.subscribers.get('abcd')).toBeDefined();
  });

  it('should publish to subscribers', () => {
    jest.spyOn(mockResponse, 'send');
    service.subscribe('abcd', mockRequest, mockResponse);
    service.publish('abcd', '1234');
    expect(mockResponse.send).toBeCalledWith('1234');
  });
});
