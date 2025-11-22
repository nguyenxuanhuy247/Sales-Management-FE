import { IsString, 
  IsNotEmpty, 
  IsPhoneNumber, 
  IsNumber, ArrayMinSize, 
  ValidateNested, 
  Length 
} from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemDTO } from './cart.item.dto';

export class OrderDTO {
  user_id: number;

  fullname: string;

  email: string;

  phone_number: string;
  
  address: string;
  
  status: string;

  note: string;
  
  total_money?: number;

  order_date?: Date;
  cart_items: { product_id: number, quantity: number }[]; // Thêm cart_items để lưu thông tin giỏ hàng


  constructor(data: any) {
    this.user_id = data.user_id;
    this.fullname = data.fullname;
    this.email = data.email;
    this.status = data.status;
    this.phone_number = data.phone_number;
    this.address = data.address;
    this.note = data.note;
    this.order_date = data.order_date;
    this.total_money = data.total_money;
    this.cart_items = data.cart_items;
  }
}

