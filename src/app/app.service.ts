import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient, private router: Router) {}

  production: boolean = false;

  rootPath: string = 'http://192.168.185.160:88/';
  apiPath: string = 'http://192.168.185.160:88/API_onhand/index.php/';
  imgPath: string = 'http://192.168.185.160:3000/getimages?code=';

  // rootPath: string = 'http://localhost:89/';
  // apiPath: string = 'http://localhost:89/API_onhand/index.php/';
  // imgPath: string = 'http://localhost:3001/getimages?code=';

  get(path: string) {
    this.production = true;
    return new Promise((resolve) => {
      this.http
        .get(this.apiPath + path)
        .toPromise()
        .then((value: any) => {
          resolve({ connect: true, ...value });
          this.production = false;
        })
        .catch((reason: any) => {
          resolve({ connect: false, ...reason });
          this.production = false;
        });
    });
  }

  getImg(path: string) {
    this.production = true;
    return new Promise((resolve) => {
      this.http
        .get(this.imgPath + path)
        .toPromise()
        .then((value: any) => {
          resolve({ connect: true, ...value });
          this.production = false;
        })
        .catch((reason: any) => {
          resolve({ connect: false, ...reason });
          this.production = false;
        });
    });
  }

  post(path: string, data: any) {
    this.production = true;
    return new Promise((resolve) => {
      this.http
        .post(this.apiPath + path, data)
        .toPromise()
        .then((value: any) => {
          resolve({ connect: true, ...value });
          this.production = false;
        })
        .catch((reason: any) => {
          resolve({ connect: false, ...reason });
          this.production = false;
        });
    });
  }

  alertTimer = (
    icon: 'error' | 'success' | 'warning',
    title: string,
    text: string = ''
  ) => {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      showConfirmButton: false,
      timer: 3000,
    });
  };

  alert = (
    icon: 'error' | 'success' | 'warning',
    title: string,
    text: string = ''
  ) => {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      confirmButtonText: `ตกลง`,
      confirmButtonColor: '#3085d6',
    });
  };

  confirm = (
    icon: 'error' | 'success' | 'warning',
    title: string,
    text: string = ''
  ) => {
    return new Promise((res) => {
      Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        cancelButtonColor: '#6c757d',
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'ตกลง',
        reverseButtons: true,
        focusCancel: true,
        focusConfirm: false,
      }).then((result) => {
        res(result.isConfirmed);
      });
    });
  };

  navRouter = (path: string, params: any = {}) => {
    this.router.navigate([`${path}`], { queryParams: params });
  };
}
