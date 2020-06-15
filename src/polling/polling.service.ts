import { Injectable } from '@nestjs/common';
import { PollingResponse, PollingRequest } from './polling.interface';

@Injectable()
export class PollingService {
  subscribers: Map<string, Array<PollingResponse<any>>>;

  constructor() {
    this.subscribers = new Map<string, Array<PollingResponse<any>>>();
  }

  subscribe<T>(
    topic: string,
    request: PollingRequest,
    response: PollingResponse<T>,
  ): void {
    let subscribers = this.subscribers.get(topic);
    if (!subscribers) {
      subscribers = new Array<PollingResponse<T>>();
      this.subscribers.set(topic, subscribers);
    }

    subscribers.push(response);
    request.on('close', () => {
      subscribers.splice(subscribers.indexOf(response));
    });
  }

  publish<T>(topic: string, body: T): void {
    let subscribers = this.subscribers.get(topic);
    if (subscribers) {
      for (const subscriber of subscribers) {
        subscriber.send(body);
      }
      subscribers = new Array<PollingResponse<T>>();
    }
  }
}
