import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts() {
    return this.productsService.getProducts();
  }

  @Get(':id')
  getProduct(@Param() param: { id: string }) {
    return this.productsService.getSingleProduct(param.id);
  }

  @Post()
  addProduct(
    @Body() body: { name: string; description: string; price: number },
  ) {
    return this.productsService.createProduct(
      body.name,
      body.description,
      body.price,
    );
  }
}
