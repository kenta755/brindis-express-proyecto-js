import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WebSocketService } from '../websocket/websocket.service';

@Controller('usuarios')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly webSocketService: WebSocketService,
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    console.log('🔍 GET /api/usuarios hit');
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.usersService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<User>,
  ): Promise<void> {
    return await this.usersService.update(id, updateData);
  }

  @Patch(':id/toggle-status')
  async toggleStatus(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const user = await this.usersService.findById(id);
    const newStatus = !user.activo;
    
    // Update user status
    await this.usersService.update(id, { activo: newStatus });
    
    // Notify all clients about the status change via WebSocket
    this.webSocketService.notifyUserStatusChange(user.email, newStatus);
    
    console.log(`🔔 User ${user.email} status changed to ${newStatus ? 'active' : 'inactive'} - notifications sent`);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { activo: boolean },
  ): Promise<void> {
    const user = await this.usersService.findById(id);
    
    // Update user status
    await this.usersService.update(id, { activo: body.activo });
    
    // Notify all clients about the status change via WebSocket
    this.webSocketService.notifyUserStatusChange(user.email, body.activo);
    
    console.log(`🔔 User ${user.email} status updated to ${body.activo ? 'active' : 'inactive'} - notifications sent`);
  }
}
