import {IsNotEmpty, IsString,} from 'class-validator';

export class InsertCategoryDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(data: any) {
    this.name = data.name;
  }
}


export class CategoryRequest {
  id: number = -1;
  name: string = "";
  description: string = "";
  date: string = "";
}