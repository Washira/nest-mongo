import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  private products = [
    {
      id: '123',
      name: 'product name',
      description: 'product description',
      price: 123,
    },
    {
      id: '456',
      name: 'product name 2',
      description: 'product description 2',
      price: 456,
    },
  ];

  getProducts() {
    return this.products;
  }

  getSingleProduct(productId: string) {
    return this.products.find((product) => product.id === productId);
  }

  createProduct(name: string, description: string, price: number) {
    const newProduct = {
      id: new Date().toString(),
      name,
      description,
      price,
    };
    this.products.push(newProduct);
    return newProduct;
  }
}
