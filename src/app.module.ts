import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), // load .env file
    MongooseModule.forRoot('mongodb://localhost:27017', {
      user: process.env.DATABASE_USER,
      pass: process.env.DATABASE_PASSWORD,
      dbName: process.env.DATABASE_NAME,
    }), // connect to the database
    ProductsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
