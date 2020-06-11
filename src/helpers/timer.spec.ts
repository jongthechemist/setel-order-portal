import { delay } from './timer';

describe('Timer', () => {
  it('should delay execution', async () => {
    expect.assertions(1);

    const delayOffset = 5000;
    const beforeDate = new Date();
    await delay(delayOffset);
    const afterDate = new Date();
    const difference = afterDate.getTime() - beforeDate.getTime();
    expect(difference).toBeGreaterThanOrEqual(delayOffset);
  });
});
