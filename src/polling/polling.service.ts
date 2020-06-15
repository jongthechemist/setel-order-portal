import { Injectable } from '@nestjs/common';

@Injectable()
export class PollingService {
  constructor() {}

  async subscribe<T>(
    getResult: () => Promise<T>,
    compareFn: (result: T) => boolean,
    interval: number = 1000,
    maxPoll: number = 50,
  ): Promise<T> {
    let poll = 0;
    return new Promise<T>((resolve, reject) => {
      setInterval(async () => {
        if (poll < maxPoll) {
          const result = await getResult();
          const hasChange = compareFn(result);
          if (hasChange) {
            resolve(result);
          }
          poll++;
        } else {
          reject('Max poll count reached');
        }
      }, interval);
    });
  }
}
