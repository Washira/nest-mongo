import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const res = new this.orderModel(createOrderDto);
    return res.save();
  }

  async findAll(): Promise<Order[]> {
    const res = await this.orderModel.find().exec();
    return res;
  }

  async findOne(id: string): Promise<Order> {
    const res = await this.orderModel.findById(id).populate('productId').exec(); // populate the product details
    return res;
  }
}
