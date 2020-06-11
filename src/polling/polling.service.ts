import { Injectable } from '@nestjs/common';
import { PollingResponse, PollingRequest } from './polling.interface';

@Injectable()
export class PollingService {
  subscribers: Map<String, Array<PollingResponse<any>>>;

  constructor() {
    this.subscribers = new Map<String, Array<PollingResponse<any>>>();
  }

  subscribe<T>(
    topic: String,
    request: PollingRequest,
    response: PollingResponse<T>,
  ) {
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

  publish<T>(topic: String, body: T) {
    let subscribers = this.subscribers.get(topic);
    if (subscribers) {
      for (let subscriber of subscribers) {
        subscriber.send(body);
      }
      subscribers = new Array<PollingResponse<T>>();
    }
  }
}
