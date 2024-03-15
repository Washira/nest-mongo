import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  @Get()
  getAllProducts() {
    return 'This will return all products';
  }

  @Post()
  addProduct(
    @Body() body: { name: string; description: string; price: number },
  ) {
    return body;
  }
}
