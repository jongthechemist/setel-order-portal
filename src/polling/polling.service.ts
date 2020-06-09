import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class PollingService {
  private _subscribers: Map<String, Array<Response>>;

  constructor() {
    this._subscribers = new Map<String, Array<Response>>();
  }

  subscribe(topic: String, request: Request, response: Response) {
    let subscribers = this._subscribers.get(topic);
    if (!subscribers) {
      subscribers = new Array<Response>();
      this._subscribers.set(topic, subscribers);
    }

    subscribers.push(response);
    request.on('close', () => {
      subscribers.splice(subscribers.indexOf(response));
    });
  }

  publish(topic: String, body: any) {
    let subscribers = this._subscribers.get(topic);
    if (subscribers) {
      for (let subscriber of subscribers) {
        subscriber.send(body);
        subscriber.end('ok');
      }
      subscribers = new Array<Response>();
    }
  }
}
