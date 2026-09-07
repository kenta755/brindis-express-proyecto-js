import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { ProductosModule } from './productos/productos.module'; 
import { VentaModule } from './venta/venta.module';
import { DetalleVentaModule } from './detalle-venta/detalle-venta.module';
import { CompraModule } from './compra/compra.module';
import { DetalleCompraModule } from './detalle-compra/detalle-compra.module';
import { CarritoCompraModule } from './carrito-compra/carrito-compra.module';
import { DetalleCarritoModule } from './detalle-carrito/detalle-carrito.module';
import { InventarioMovimientoModule } from './inventario-movimiento/inventario-movimiento.module';
import { DevolucionVentaModule } from './devolucion-venta/devolucion-venta.module';
import { DetalleDevolucionVentaModule } from './detalle-devolucion-venta/detalle-devolucion-venta.module';
import { DevolucionCompraModule } from './devolucion-compra/devolucion-compra.module';
import { DetalleDevolucionCompraModule } from './detalle-devolucion-compra/detalle-devolucion-compra.module';
import { CategoriaModule } from './categoria/categoria.module';
import { MetodoPagoModule } from './metodo_pago/metodo-pago.module';
import { PromocionesModule } from './promociones/promociones.module';
import { WebSocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const isRailway = configService.get<string>('RAILWAY_ENVIRONMENT') || process.env.RAILWAY_ENVIRONMENT;
        
        // For Railway: use DATABASE_URL with SSL
        // For local: use individual config
        if (databaseUrl) {
          console.log('Using DATABASE_URL for PostgreSQL connection');
          
          if (databaseUrl.includes('.railway.internal')) {
            console.warn('WARNING: Using private Railway database URL (.railway.internal)');
            console.warn('If connection fails, use the PUBLIC database URL instead');
          }
          
          const isLocalhost = databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1');
          
          return {
            type: 'postgres',
            url: databaseUrl,
            autoLoadEntities: true,
            synchronize: true,
            ssl: isLocalhost ? false : { rejectUnauthorized: false },
            extra: {
              max: 10,
              connectionTimeoutMillis: 30000,
              idleTimeoutMillis: 10000,
            },
          };
        }
        
        // Railway requires DATABASE_URL - fail if missing
        if (isRailway) {
          throw new Error('DATABASE_URL environment variable is required in Railway. Please add it in Variables tab.');
        }
        
        // Local development fallback
        console.log('Using local MySQL configuration');
        return {
          type: 'mysql',
          host: configService.get<string>('DB_HOST') || 'localhost',
          port: 3306,
          username: configService.get<string>('DB_USERNAME') || 'root',
          password: configService.get<string>('DB_PASSWORD') || 'root',
          database: configService.get<string>('DB_DATABASE') || 'brazzino',
          autoLoadEntities: true,
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProveedoresModule,
    ProductosModule,
    VentaModule,
    DetalleVentaModule,
    CompraModule,
    DetalleCompraModule,
    CarritoCompraModule,
    DetalleCarritoModule,
    InventarioMovimientoModule,
    DevolucionVentaModule,
    DetalleDevolucionVentaModule,
    DevolucionCompraModule,
    DetalleDevolucionCompraModule,
    CategoriaModule,
    PromocionesModule,
    MetodoPagoModule,
    WebSocketModule,
  ],
  controllers: [],
  providers: [
   /* {
   //   provide: APP_GUARD,
    //  useClass: JwtAuthGuard, // Guard global para toda la aplicación
    },*/
  ],
})
export class AppModule {}