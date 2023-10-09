import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(public services: AppService) {}

  ip: any = null;
  deviceName: any = null;

  ngOnInit(): void {
    this.getIP();
  }

  getIP = async () => {
    this.services.get('getRemoteHost').then((value: any) => {
      // console.log(value);
      if (value.connect) {
        this.ip = Object.values(value)
          .filter((value) => typeof value === 'string')
          .join('');
        // console.log(this.ip);
        sessionStorage.setItem('ip', this.ip);
        let key = new FormData();
        key.append('ip', this.ip);
        this.services
          .post('BasketShelf/listStorages', key)
          .then((value: any) => {
            // console.log(value);
            if (value.connect) {
              if (value[0]) {
                this.deviceName = value[0]['groupName'];
              }else {
                this.services.alert(
                  'warning',
                  this.ip + ' ยังไม่ได้ลงทะเบียน',
                  'โปรดติดต่อผู้ดูแลระบบ'
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
        this.services.alert(
          'error',
          'ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้',
          'โปรดติดต่อผู้ดูแลระบบ'
        );
      }
    });
  };
}
