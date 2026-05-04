import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class WebSocketService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Map to track which socket belongs to which user
  private userSockets: Map<string, string> = new Map(); // email -> socketId

  handleConnection(client: Socket) {
    console.log(`🔌 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔌 Client disconnected: ${client.id}`);
    // Remove from userSockets map
    for (const [email, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(email);
        console.log(`👤 User ${email} removed from active sockets`);
        break;
      }
    }
  }

  @SubscribeMessage('register')
  handleRegister(client: Socket, email: string) {
    this.userSockets.set(email, client.id);
    console.log(`📝 User registered for status notifications: ${email}`);
    client.emit('registered', { success: true, email });
  }

  @SubscribeMessage('unregister')
  handleUnregister(client: Socket, email: string) {
    this.userSockets.delete(email);
    console.log(`📝 User unregistered from status notifications: ${email}`);
  }

  // Notify a specific user that their status has changed
  notifyUserStatusChange(email: string, isActive: boolean) {
    const socketId = this.userSockets.get(email);
    if (socketId) {
      this.server.to(socketId).emit('statusChanged', {
        email,
        isActive,
        timestamp: new Date().toISOString(),
        message: isActive 
          ? 'Tu cuenta ha sido activada. Puedes continuar usando el sistema.'
          : 'Tu cuenta ha sido desactivada. Serás redirigido al login.',
      });
      console.log(`📢 Status change notification sent to ${email}: ${isActive ? 'ACTIVE' : 'INACTIVE'}`);
    } else {
      console.log(`⚠️ User ${email} not connected - no real-time notification sent`);
    }

    // Also broadcast to all admin clients for real-time updates
    this.server.emit('userStatusUpdated', {
      email,
      isActive,
      timestamp: new Date().toISOString(),
    });
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  // Check if user is online
  isUserOnline(email: string): boolean {
    return this.userSockets.has(email);
  }
}
