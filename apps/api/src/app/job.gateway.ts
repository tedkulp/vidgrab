import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { pick } from 'lodash';
import { Server, Socket } from 'socket.io';

import { JobEvent } from '@vidgrab2/api-interfaces';

@WebSocketGateway()
export class JobGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(JobGateway.name);

  @WebSocketServer()
  private server: Server | undefined;
  private clients: Socket[] = [];

  handleConnection(client: Socket) {
    this.clients.push(client);
    this.logger.verbose('handleConnection', client);
  }

  handleDisconnect(client: Socket) {
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i] === client) {
        this.clients.splice(i, 1);
        break;
      }
    }

    this.logger.verbose('handleDisconnect', client);
  }

  private broadcast(event: string, message: any) {
    const broadCastMessage = JSON.stringify(message);
    for (const c of this.clients) {
      c.send(event, broadCastMessage);
    }
  }

  @OnEvent('job.added')
  async sendAddedJob(payload: JobEvent) {
    if (this.server && payload.job) {
      const state = await payload.job.getState();
      const progress = payload.job.progress();

      payload.job = {
        ...pick(payload.job, ['id', 'name', 'data']),
        progress: progress ? `${progress}%` : 'n/a',
        state: state,
      };
      this.server.emit('job.added', payload);
    }
  }

  @OnEvent('job.updated')
  async sendJobUpdate(payload: JobEvent) {
    if (this.server && payload.job) {
      const state = await payload.job.getState();
      const progress = payload.job.progress();

      payload.job = {
        ...pick(payload.job, ['id', 'name', 'data']),
        progress: progress ? `${progress}%` : 'n/a',
        state: state,
      };
      this.server.emit('job.updated', payload);
    }
  }
}
