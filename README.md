# NestJS and MongoDB

- [NestJS and MongoDB](#nestjs-and-mongodb)
  - [Description](#description)
  - [Installation](#installation)
  - [Running the app](#running-the-app)
  - [Test](#test)
  - [Support](#support)
  - [ER Diagram](#er-diagram)
  - [Directory Structure](#directory-structure)
  - [Mongo](#mongo)
  - [CRUD Operations](#crud-operations)
  - [Create Dto](#create-dto)
    - [Schema](#schema)
    - [Add into `products.module.ts`](#add-into-productsmodulets)
    - [Add into `products.service.ts`](#add-into-productsservicets)
  - [Validation](#validation)

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## ER Diagram

```mermaid
erDiagram
    MODULE {
        name string
        imports string[]
        controller string[]
        providers string[]
        exports string[]
    }

    APPLICATION ||--o{ MODULE : contains
    MODULE ||--o{ MODULE : imports
    MODULE ||--o{ CONTROLLER : defines
    CONTROLLER ||--o{ SERVICE : uses
    SERVICE ||--|| PROVIDER : implements
    SERVICE ||--|| PROVIDER : implements
    MODULE ||--|{ PROVIDER : provides
    SERVICE }|--|{ DATABASE : interacts-with
```

## Directory Structure

เมื่อสร้างโปรเจค NestJS จะได้โครงสร้างไฟล์ดังนี้

```bash
├── nest-cli.json
├── package-lock.json
├── package.json
├── src
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
```

การสร้างโครงสร้างไฟล์เพิ่มเติม

เราสามารถสร้างไฟล์โดยใช้คำสั่ง `nest generate` หรือ `nest g` โดยตัวอย่างเช่น

```bash
nest generate controller <name>
nest generate service <name>
nest generate module <name>
nest generate provider <name>
```

หรือต้องการสร้างทีเดียว ได้ไฟล์ทั้งหมด เรียกว่าการสร้าง CRUD resource 
โดยใช้คำสั่ง `nest generate resource` หรือ `nest g resource` โดยตัวอย่างเช่น

```bash
nest g resource <name>
```

## Mongo

ติดตั้ง mongoose

```bash
npm i @nestjs/mongoose mongoose
```

เพิ่ม `docker-compose.yml` สำหรับ MongoDB

```bash
touch docker-compose.yml
```

คำสั่งในการ execute docker-compose.yml

```bash
docker-compose up -d
```

คำสั่งในการ stop docker-compose.yml

```bash
docker-compose down
```

คำสั่งในการเช็ค container ที่กำลังทำงาน

```bash
docker ps
```

คำสั่งในการเช็ค container ที่เคยทำงาน

```bash
docker ps -a
```

คำสั่งในการเข้า container

```bash
docker exec -it <container_id> bash
```

คำสั่งในการเข้า mongo shell

```bash
mongosh -u <username> -p <password>
```

คำสั่งในการออกจาก mongo shell หรือ container

```bash
exit
```

เพิ่ม `app.module.ts` สำหรับเชื่อมต่อ MongoDB

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forRoot('mongodb://localhost/nest'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
## CRUD Operations

เริ่มจากการทำ Dto ก่อน

## Create Dto

`Dto` คือ Data Transfer Object เป็นตัวแทนข้อมูลที่ใช้ส่งไปมาระหว่าง client และ server

ในไฟล์ `create-product.dto.ts` ให้กำหนด object ที่ใช้เป็น request body สำหรับ create product

```typescript
export class CreateProductDto {
  readonly name: string;
  readonly description?: string;
  readonly price: number;
}
```

`?` คือ optional หมายถึงไม่จำเป็นต้องใส่ข้อมูลก็ได้

### Schema

`Entity` คือ object ที่ใช้เป็น model ของ SQL database มักจะใช้งานร่วมกับ TypeORM หรือ Sequelize
ส่วน `Schema` คือ object ที่ใช้เป็น model ของ NoSQL database มักจะใช้งานร่วมกับ Mongoose

เนื่องจากเราใช้ MongoDB ดังนั้นเราจะใช้ mongoose ในการกำหนด schema ของ product

จึงไม่ใช้ Entity แต่ใช้ Schema แทน

สร้าง `schema` folder สำหรับ products module ซึ่งภายใน ให่้สร้างไฟล์ `product.schema.ts`

ในไฟล์ `product.schema.ts` ให้กำหนด schema ของ product

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
```

จะมีการ export `Product`, `ProductDocument` และ `ProductSchema` ออกไปใช้งาน

### Add into `products.module.ts`

เพิ่ม `MongooseModule.forFeature` ใน `products.module.ts` สำหรับเชื่อมต่อ schema ของ product

จะมีการ import `Product` และ `ProductSchema` มาใช้งาน

```typescript
  import { Module } from '@nestjs/common';
  import { MongooseModule } from '@nestjs/mongoose';
  import { ProductsController } from './products.controller';
  import { ProductsService } from './products.service';
+ import { Product, ProductSchema } from './schemas/product.schema';

  @Module({
+   imports: [
+     MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
+   ],
    controllers: [ProductsController],
    providers: [ProductsService],
  })
  export class ProductsModule {}
```

`forFeature` คือ method ที่ใช้เชื่อมต่อ schema ของ product กับ MongooseModule
ภายในมี object ที่มี key คือ `name` และ `schema` โดย

- `name` คือชื่อของ schema
- `schema` คือ schema ของ product

### Add into `products.service.ts`

ในส่วนของ `product.schema.ts` จะมีการ import `Product` และ `ProductDocument` มาใช้งาน

ในส่วนของ `@nestjs/mongoose` จะมีการ import `InjectModel` 

ในส่วนของ `mongoose` จะมีการ import `Model` และ `InjectModel`

```typescript
  // products.service.ts
  import { Body, Controller, Get, Post } from '@nestjs/common';
  import { CreateProductDto } from './dto/create-product.dto';
  import { ProductsService } from './products.service';
+ import { Product, ProductDocument } from './schemas/product.schema';
+ import { InjectModel } from '@nestjs/mongoose';
+ import { Model } from 'mongoose'
```

ต่อมา สร้าง constructor ใน `ProductsService` และใช้ `@InjectModel` ในการ inject dependencies จาก `mongoose`
ในที่นี้คือ `Product`
และประกาศตัวแปรที่จะเรียกใช้งานใน `ProductsService` คือ `productModel`
ซึ่งมี concept คล้ายๆกับ controller

```typescript
  @Injectable()
  export class ProductsService {
+   constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}
  ...
  }
```

ลองเรียกใช้ `productModel` ใน `ProductsService` ด้วยการเพิ่ม expression สำหรับ create product

```typescript
  @Injectable()
  export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

+   async create(createProductDto: CreateProductDto): Promise<Product> {
+     const createdProduct = new this.productModel(createProductDto);
+     return createdProduct.save();
+   }
  ...
  }
```

เนื่องจาก `createdProduct.save()` เป็น promise จึงให้ใส่ `async` และ `await` ในการรอให้ promise สำเร็จ

ความเจ๋งของ `Next.js` คือ เมื่อมีการระบุ `async` ใน method ของ service แล้ว การเรียกใช้งานในฝั่ง controller ไม่ต้องระบุ `async` และ `await` อีก

เมื่อลอง request POST ผ่าน Postman จะได้ response ประมาณนี้

```json
{
    "_id": "60f3e3e3e3e3e3e3e3e3e3e3",
    "name": "Product 1",
    "description": "Description 1",
    "price": 1000,
    "__v": 0
}
```

ก็ถือว่าการติดตั้ง Mongoose ใน CRUD สำเร็จแล้ว

## Validation

ในบางครั้งที่เราอาจจะส่ง request body ที่ไม่ถูกต้อง ซึ่งอาจจะทำให้เกิด error ในการบันทึกข้อมูลลงใน database
และเมื่อเกิด error จะได้ response กลับไปว่า Internal server error ประมาณนี้

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

ปัญหาคือ เราไม่ทราบว่า field ไหนที่ส่งข้อมูลไม่ถูกต้อง ถ้าเราต้องการรายละเอียดของ error จะต้องทำการ validate request body ก่อน

เราสามารถใช้ `class-validator` ในการ validate request body ของ create product

ติดตั้ง `class-validator` และ `class-transformer`

```bash
npm i class-validator class-transformer
```

เพิ่ม `class-validator` ใน `create-product.dto.ts`

```typescript
+ import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

  export class CreateProductDto {
+   @IsNotEmpty()
+   @IsString()
    readonly name: string;

+   @IsOptional()
+   @IsString()
    readonly description?: string;

+   @IsNotEmpty()
+   @IsNumber()
    readonly price: number;
  }
```

แต่ `class-validator` ไม่ได้มากับ `Nest.js` จึงต้องเพิ่ม `class-validator` ใน `main.ts` ด้วย

```typescript
+ import { ValidationPipe } from '@nestjs/common';
  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';

  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
+   app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
  }
  bootstrap();
```

เมื่อลอง request POST หรือ PATCH ผ่าน Postman ด้วย request body `price` ที่ไม่ถูกต้อง จะได้ response ประมาณนี้

```json
{
  "message": [
      "price must be a number conforming to the specified constraints"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```
