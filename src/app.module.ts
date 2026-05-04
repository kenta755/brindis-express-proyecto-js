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
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    // Usamos la URL completa que es más confiable en Railway
    url: configService.get<string>('DATABASE_URL'), 
    autoLoadEntities: true,
    synchronize: true,
    ssl: {
      rejectUnauthorized: false, // Obligatorio para conexiones externas
    },
  }),
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