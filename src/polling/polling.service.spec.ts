import { Test, TestingModule } from '@nestjs/testing';
import { PollingService } from './polling.service';

describe('PollingService', () => {
  let service: PollingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PollingService],
    }).compile();

    service = module.get<PollingService>(PollingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should resolve when compare function returns true', async () => {
    expect.assertions(1)
    const originalResult = 'a'

    let newResult = 'a'
    setTimeout(() => newResult = 'b', 1000)
    const getResult = jest.fn(() => {
      return new Promise((resolve) => resolve(newResult))
    })
    const compareFn = jest.fn((res) => res !== originalResult)

    const latestResult = await service.subscribe(getResult, compareFn);
    
    expect(latestResult).toBe('b');
  });

  it('should not resolve when result compare function returns false longer than interval * maxPoll', async () => {
    expect.assertions(1)
    const originalResult = 'a'

    let newResult = 'a'
    setTimeout(() => newResult = 'b', 1000)
    const getResult = jest.fn(() => {
      return new Promise((resolve) => resolve(newResult))
    })
    const compareFn = jest.fn((res) => res !== originalResult)

    try {
      await service.subscribe(getResult, compareFn, 50, 10);
    } catch(e) {
      expect(e).toBeDefined();
    }
   
  });
});
