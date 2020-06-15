import { Injectable } from '@nestjs/common';

@Injectable()
export class PollingService {
  async subscribe<T>(
    getResult: () => Promise<T>,
    compareFn: (result: T) => boolean,
    interval = 1000,
    maxPoll = 50,
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
