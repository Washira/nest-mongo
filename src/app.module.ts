import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }), // load .env file
    MongooseModule.forRoot('mongodb://localhost:27017', {
      user: process.env.DATABASE_USER,
      pass: process.env.DATABASE_PASSWORD,
      dbName: process.env.DATABASE_NAME,
    }), // connect to the database
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
