import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('newClientEntry')
  handleNewClient(@MessageBody() data: any): void {
    this.server.emit('clientAdded', data);
  }
}