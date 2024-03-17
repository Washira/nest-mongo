import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    return this.productModel.findById(id);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = this.productModel
      .findByIdAndUpdate(id, updateProductDto, {
        new: true, // return the updated document
      })
      .exec();
    return updatedProduct;
  }

  async remove(id: string) {
    try {
      const removedProduct = await this.productModel
        .findByIdAndDelete(id)
        .exec();
      if (!removedProduct) {
        throw new NotFoundException('Product not found');
      }
      return { message: 'Product removed' };
    } catch (error) {
      throw error;
    }
  }
}
