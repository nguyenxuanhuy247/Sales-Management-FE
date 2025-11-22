import {Component, OnInit} from '@angular/core';
import {InsertProductDTO} from '../../../../dtos/product/insert.product.dto';
import {Category} from '../../../../models/category';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ApiResponse} from '../../../../responses/api.response';
import {HttpErrorResponse} from '@angular/common/http';
import {BaseComponent} from '../../../base/base.component';

@Component({
  selector: 'app-insert.product.admin',
  templateUrl: './insert.product.admin.component.html',
  styleUrls: ['./insert.product.admin.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class InsertProductAdminComponent extends BaseComponent implements OnInit {
  insertProductDTO: InsertProductDTO = {
    name: '',
    price: 0,
    description: '',
    category_id: 1,
    images: []
  };
  categories: Category[] = []; // Dữ liệu động từ categoryService    
  ngOnInit() {
    this.getCategories(1, 100)
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.categories = apiResponse.data;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      }
    });
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 5) {
      console.error('Please select a maximum of 5 images.');
      return;
    }

    this.insertProductDTO.images = files;
  }

  onBack() {
    this.router.navigate(['/admin/products']);
  }

  insertProduct() {
    this.productService.insertProduct(this.insertProductDTO).subscribe({
      next: (apiResponse: ApiResponse) => {

        if (this.insertProductDTO.images.length > 0) {
          const productId = apiResponse.data.id;
          this.productService.uploadImages(productId, this.insertProductDTO.images).subscribe({
            next: (imageResponse: ApiResponse) => {
              this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            },
            error: (error: HttpErrorResponse) => {

              console.error(error?.error?.message ?? '');
            }
          })
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      }
    });
  }
}
