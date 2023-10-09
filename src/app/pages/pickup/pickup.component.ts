import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/app.service';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.component.html',
  styleUrls: ['./pickup.component.scss'],
})
export class PickupComponent implements OnInit {
  isLoading = false;
  startDate: any = null;
  endDate: any = null;

  campaign = new FormGroup({
    start: new FormControl(
      new Date(new Date().setDate(new Date().getDate() - 1))
    ),
    end: new FormControl(
      new Date(new Date().setDate(new Date().getDate() - 1))
    ),
  });

  listPickup: Array<any> = [];
  public dataPickup: any = null;
  @ViewChild('sortPickup') sortPickup!: MatSort;
  @ViewChild('paginatorPickup') paginatorPickup!: MatPaginator;
  public displayedPickup: string[] = [
    'checkInDT',
    'patientQN',
    'patientNO',
    'patientName',
  ];

  listOrder: Array<any> = [];
  orderDetial: any = null;
  public dataOrder: any = null;
  @ViewChild('sortOrder') sortOrder!: MatSort;
  @ViewChild('paginatorOrder') paginatorOrder!: MatPaginator;
  public displayedOrder: string[] = [
    'seq',
    'orderitemname',
    'freetext1',
    'orderqty',
    'price',
    'img',
    // 'orderunitcode',
    // 'itemidentify',

    // 'freetext2',
  ];

  constructor(public services: AppService) {}

  ngOnInit(): void {
    this.startDate = moment(this.campaign.value.start).format('YYYY-MM-DD');
    this.endDate = moment(this.campaign.value.end).format('YYYY-MM-DD');
    this.getPickup();
  }

  startChange(event: any) {
    const momentDate = new Date(event.value);
    this.startDate = moment(momentDate).format('YYYY-MM-DD');
  }

  endChange(event: any) {
    const momentDate = new Date(event.value);
    this.endDate = moment(momentDate).format('YYYY-MM-DD');
    if (this.endDate !== '1970-01-01') {
      this.getPickup();
    }
  }

  getPickup() {
    // console.log(this.startDate);
    // console.log(this.endDate);
    this.isLoading = true;
    this.listPickup = [];
    this.dataPickup = null;
    let key = new FormData();
    key.append('startDate', this.startDate);
    key.append('endDate', this.endDate);
    this.services.post('BasketShelf/listPickup', key).then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listPickup = value.result;
          this.dataPickup = new MatTableDataSource(this.listPickup);
          this.dataPickup.sort = this.sortPickup;
          this.dataPickup.paginator = this.paginatorPickup;
        }
      } else {
        this.services.alert(
          'error',
          'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
          'โปรดติดต่อผู้ดูแลระบบ'
        );
      }
      this.isLoading = false;
    });
  }

  getOrder(e: any) {
    // console.log(e);
    this.isLoading = true;
    this.listOrder = [];
    this.orderDetial = null;
    let key = new FormData();
    key.append('patientNO', e.patientNO);
    key.append('patientQN', e.patientQN);
    this.services.post('BasketShelf/listDrugOrder', key).then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listOrder = value.result;
          console.log(this.listOrder);
          this.orderDetial = this.listOrder[0];
          this.listOrder.forEach((e) => {
            this.services.getImg(e.orderitemcode).then((value: any) => {
              // console.log(value);
              if (value.connect) {
                if (value[0]) {
                  let arr = value;

                  let maxKey = -Infinity;
                  for (const key in arr) {
                    if (!isNaN(Number(key)) && Number(key) > maxKey) {
                      maxKey = Number(key);
                    }
                  }
                  // console.log(maxKey);
                  const imgPath = arr[maxKey]['pathImage'].substring(
                    arr[maxKey]['pathImage'].indexOf(
                      'api/assets/drug-imagecenter'
                    )
                  );
                  // console.log(this.services.rootPath + imgPath);
                  e.img = this.services.rootPath + imgPath;
                }
              } else {
                this.services.alert(
                  'error',
                  'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
                  'โปรดติดต่อผู้ดูแลระบบ'
                );
              }
            });
          });
          this.dataOrder = new MatTableDataSource(this.listOrder);
          this.dataOrder.sort = this.sortOrder;
          this.dataOrder.paginator = this.paginatorOrder;
        }
      } else {
        this.services.alert(
          'error',
          'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
          'โปรดติดต่อผู้ดูแลระบบ'
        );
      }
      this.isLoading = false;
    });
  }

  back() {
    this.listOrder = [];
    this.orderDetial = null;
  }

  viewImg = async (e: any) => {
    Swal.fire({
      title: e.orderitemname,
      imageUrl: e.img,
      imageAlt: 'Popup Image',
      showCloseButton: true,
      showConfirmButton: false,
      // width: `800px`,
    });
  };
}
