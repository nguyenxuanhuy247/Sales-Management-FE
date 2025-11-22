import { Component, ViewChild, OnInit, inject } from '@angular/core';
import { LoginDTO } from '../../dtos/user/login.dto';
import { NgForm } from '@angular/forms';
import { Role } from '../../models/role'; // Đường dẫn đến model Role
import { UserResponse } from '../../responses/user/user.response';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '../base/base.component';

import { tap, switchMap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        CommonModule,
        FormsModule
    ]
})
export class LoginComponent extends BaseComponent implements OnInit{
  @ViewChild('loginForm') loginForm!: NgForm;  
    

  /*
  //Login user1
  phoneNumber: string = '33445566';
  password: string = '123456789';

  //Login user2
  phoneNumber: string = '0964896239';
  password: string = '123456789';


  //Login admin
  phoneNumber: string = '11223344';
  password: string = '11223344';

  */
  phoneNumber: string = '33445566';
  password: string = '123456789';
  showPassword: boolean = false;

  roles: Role[] = []; // Mảng roles
  rememberMe: boolean = true;
  selectedRole: Role | undefined; // Biến để lưu giá trị được chọn từ dropdown
  userResponse?: UserResponse

  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
    //how to validate ? phone must be at least 6 characters
  }
  

  ngOnInit() {
    // Gọi API lấy danh sách roles và lưu vào biến roles
    
    this.roleService.getRoles().subscribe({
      next: ({ data: roles }: ApiResponse) => {
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast({
          error: error,
          defaultMsg: 'Lỗi tải danh sách vai trò',
          title: 'Lỗi Tải Vai Trò'
        });
      }
    });    
  }
  
  login() {
    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    };
  
    this.userService.login(loginDTO).pipe(
      tap((apiResponse: ApiResponse) => {
        const { token } = apiResponse.data;
        this.tokenService.setToken(token);
      }),
      switchMap((apiResponse: ApiResponse) => {
        const { token } = apiResponse.data;
        return this.userService.getUserDetail(token).pipe(
          tap((apiResponse2: ApiResponse) => {
            this.userResponse = {
              ...apiResponse2.data,
              date_of_birth: new Date(apiResponse2.data.date_of_birth),
            };
  
            if (this.rememberMe) {
              this.userService.saveUserResponseToLocalStorage(this.userResponse);
            }
  
            if (this.userResponse?.role.name === 'admin') {
              this.router.navigate(['/admin']);
            } else if (this.userResponse?.role.name === 'user') {
              this.toastService.showToast({
                error: "Vui lòng đăng nhập tài khoản admin",
                defaultMsg: 'Vui lòng đăng nhập tài khoản admin',
                title: 'Lỗi Đăng Nhập'
              });
            }
          }),
          catchError((error: HttpErrorResponse) => {
            console.error('Lỗi khi lấy thông tin người dùng:', error?.error?.message ?? '');
            return of(null); // Tiếp tục chuỗi Observable
          })
        );
      }),
      finalize(() => {
        this.cartService.refreshCart();
      })
    ).subscribe({
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast({
          error: error,
          defaultMsg: 'Sai thông tin đăng nhập',
          title: 'Lỗi Đăng Nhập'
        });
      }
    });
  }
  
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
