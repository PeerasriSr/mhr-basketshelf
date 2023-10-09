import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/app.service';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(public services: AppService) {
    this.isLoading = true;
    this.spaceClearYesterday();
    this.myInterval = setInterval(() => {
      this.ip = sessionStorage.getItem('ip');
      if (this.ip) {
        clearInterval(this.myInterval);
        this.getSpace();
      }
    }, 500);
  }

  isLoading = false;

  rowHeight = (window.innerHeight - 110) / 5;
  tableHeight = (window.innerHeight - 260) / 2;

  ip: any = null;

  listStorages: Array<any> = [];
  colStorages: any = null;

  patientNO: string = '';
  patientData: any = null;
  myInterval: any;
  highlight: boolean = false;
  spEvent: any = null;
  oderEvent: any = null;

  listCheckIn: Array<any> = [];
  dataCheckIn: any = null;
  displayedCheckIn: string[] = [
    'isTime',
    'patientQN',
    'patientNO',
    'patientName',
    'index',
  ];
  listCheckOut: Array<any> = [];
  dataCheckOut: any = null;
  displayedCheckOut: string[] = [
    'isTime',
    'patientQN',
    'patientNO',
    'patientName',
    'index',
  ];

  @ViewChild('swiper') swiper!: ElementRef;

  ngOnInit(): void {
    setTimeout(() => {
      this.swiper.nativeElement.focus();
    }, 100);
    // this.getSpaces();
  }

  spaceClearYesterday() {
    this.services.get('BasketShelf/spaceClearYesterday').then((value: any) => {
      // console.log(value);
    });
  }

  getSpace() {
    this.listStorages = [];
    let key = new FormData();
    key.append('ip', this.ip);
    this.services.post('BasketShelf/listStorages', key).then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value[0]) {
          this.listStorages.push(value[0]);
          //  console.log(this.listStorages)
          //  this.colStorages = this.listStorages.length;
          this.getCheckIn();
          this.getCheckOut();
        } else {
        }
      } else {
        this.services.alert(
          'error',
          'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
          'โปรดติดต่อผู้ดูแลระบบ'
        );
      }
    });
  }

  getCheckIn() {
    this.isLoading = true;
    this.listCheckIn = [];
    this.dataCheckIn = null;
    this.services.get('BasketShelf/listCheckIn').then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listCheckIn = value.result;
          // console.log(this.listCheckIn);
          this.dataCheckIn = new MatTableDataSource(this.listCheckIn);
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

  getCheckOut() {
    this.isLoading = true;
    this.listCheckOut = [];
    this.dataCheckOut = null;
    this.services.get('BasketShelf/listCheckOut').then((value: any) => {
      // console.log(value);
      if (value.connect) {
        if (value.rowCount > 0) {
          this.listCheckOut = value.result;
          // console.log(this.listCheckOut);
          this.dataCheckOut = new MatTableDataSource(this.listCheckOut);
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

  readHn(e: any) {
    // console.log(e);
    // let hn = e.padStart(7, ' ');
    let hn = e;
    let iSpace: any = null;
    let iOrder: any = null;
    let empty: any = null;
    this.listStorages.forEach((i) => {
      i.spaces.forEach((j: any) => {
        if (!empty && j.spaceStatus === 'Y') {
          empty = j.spaceID;
        }
        if (j.patientNO) {
          if (j.patientNO === hn) {
            // console.log(j);
            iSpace = j.spaceID;
            iOrder = j.orderID;
          }
        }
      });
    });
    let key = new FormData();
    key.append('patientNO', hn);
    key.append('location', this.listStorages[0]['location']);
    if (!iSpace) {
      if (empty) {
        // console.log(moment().format('YYMMDDhhmmss') + '-' + e.padStart(7, '0'));
        this.services.post('BasketShelf/getPatienQ', key).then((value: any) => {
          // console.log(value);
          if (value.connect) {
            if (value.rowCount > 0) {
              this.patientData = null;
              this.patientData = value.result[0];
              key.append('patientName', this.patientData.patientName);
              key.append('patientQN', this.patientData.QN);
              key.append('orderStatus', 'checkIn');
              // console.log(this.listCheckOut[0]['patientNO']);
              // console.log(hn);
              if (this.listCheckOut.length > 0) {
                if (hn === this.listCheckOut[0]['patientNO']) {
                  empty = this.listCheckOut[0]['spaceID'];
                }
              }

              key.append('spaceID', empty);
              key.append(
                'orderID',
                moment().format('YYMMDDhhmmss') + e.padStart(7, '0')
              );
              // key.forEach((value, key) => {
              //   console.log(key + ' : ' + value);
              // });
              this.services
                .post('BasketShelf/spaceCheckIn', key)
                .then((value: any) => {
                  // console.log(value);
                  if (value.connect) {
                    if (value.rowCount > 0) {
                      this.services
                        .post('BasketShelf/orderCheckIn', key)
                        .then((value: any) => {
                          // console.log(value);
                          if (value.connect) {
                            if (value.rowCount > 0) {
                              clearInterval(this.myInterval);
                              this.spEvent = empty;
                              this.oderEvent = 'in';
                              this.getSpace();
                              this.myInterval = setInterval(
                                this.changeHiLi,
                                800
                              );
                            } else {
                            }
                          } else {
                            this.services.alert(
                              'error',
                              'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
                              'โปรดติดต่อผู้ดูแลระบบ'
                            );
                          }
                        });
                    } else {
                    }
                  } else {
                    this.services.alert(
                      'error',
                      'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
                      'โปรดติดต่อผู้ดูแลระบบ'
                    );
                  }
                });
            } else {
              this.services.alertTimer(
                'warning',
                'ไม่พบ HN ของคนไข้',
                'กรุณาตรวจสอบข้อมูล'
              );
            }
          } else {
            this.services.alert(
              'error',
              'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
              'โปรดติดต่อผู้ดูแลระบบ'
            );
          }
        });
      } else {
        this.services.alert('warning', 'ช่องเต็ม', 'กรุณาเคลียร์ช่องว่าง');
      }
    } else {
      key.append('spaceID', iSpace);
      key.append('orderID', iOrder);
      // key.forEach((value, key) => {
      //   console.log(key + ' : ' + value);
      // });
      this.services
        .post('BasketShelf/spaceCheckOut', key)
        .then((value: any) => {
          // console.log(value);
          if (value.connect) {
            if (value.rowCount > 0) {
              this.services
                .post('BasketShelf/orderCheckOut', key)
                .then((value: any) => {
                  // console.log(value);
                  if (value.connect) {
                    if (value.rowCount > 0) {
                      clearInterval(this.myInterval);
                      this.spEvent = iSpace;
                      this.oderEvent = 'out';
                      this.getSpace();
                      this.myInterval = setInterval(this.changeHiLi, 800);
                    } else {
                    }
                  } else {
                    this.services.alert(
                      'error',
                      'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
                      'โปรดติดต่อผู้ดูแลระบบ'
                    );
                  }
                });
            } else {
            }
          } else {
            this.services.alert(
              'error',
              'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
              'โปรดติดต่อผู้ดูแลระบบ'
            );
          }
        });
    }
  }

  public changeHiLi = async () => {
    this.highlight = this.highlight == true ? false : true;
  };
}
