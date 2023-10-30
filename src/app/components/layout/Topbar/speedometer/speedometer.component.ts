import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core'

const baseUrl = "/assets/images/speedometer-download.jpg";
const fileSizeInBytes = 1048576;
const baseHeader: any = {headers: {'Content-Type': 'application/json'}, 'responseType': 'text'};
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+`-=[]{}|;':,./<>?";

@Component({
  selector: 'speedometer',
  templateUrl: './speedometer.component.html',
  styleUrls: ['./speedometer.component.scss'],
})
export class SpeedometerComponent {
    isVisible = false;
    assetsPath = '/assets/svg/speedtest';
    waiting = false;
  
    feature = [
      {icon: `${this.assetsPath}/speed.svg`, value: '0 ms'},
      {icon: `${this.assetsPath}/download.svg`, value: '0 bps'},
      {icon: `${this.assetsPath}/upload.svg`, value: '0 bps'}
    ]

    constructor(private _http: HttpClient){}
    
    showModal(): void { 
        this.isVisible = true;
        this.feature[0].value = '0 ms';
        this.feature[1].value = '0 bps';
        this.feature[2].value = '0 bps';
    }
    handleCancel(): void { this.isVisible = false; }
    
    handleOk(): void {
    this.check();    
    }
    

    check() {
        if(this.waiting) { return; }
        this.waiting = true;
        Promise.all([
          this.checkUpload(),
          this.checkDownload()
        ]).then(
          (resp: any) => { 
            this.waiting = false;
            this.feature[0].value = resp[1]?.ping || '0 ms';
            this.feature[1].value = resp[1]?.download || '0 bps';
            this.feature[2].value = resp[0] || '0 bps';
          },
          (err)  => {
            this.waiting = false;
            this.feature[0].value = '--';
            this.feature[1].value = '0 bps';
            this.feature[2].value = '0 bps';
          }
        );
      }

    
  checkDownload(): Promise<any> {
    const startTime = new Date().getTime();
    return new Promise((resolve, reject) => {
      this._http.get(baseUrl, baseHeader).subscribe(
        (response) => {
          const endTime = new Date().getTime();
          const duration = (endTime - startTime) / 1000;
          const bitsLoaded = fileSizeInBytes * 8;
          const scale = this.getScale(bitsLoaded, duration);
          resolve({
            download: `${scale.value.toFixed(2)} ${scale.speed}`,
            ping: `${(duration*1000).toFixed(2)} ms`
          });
          
        }, (err) => {reject(err);}
      );
    });
  }

    private checkUpload(): Promise<string> {
        const startTime = new Date().getTime();
        const defaultData = this.generateTestData(fileSizeInBytes / 1000);
        const data = JSON.stringify({ message: defaultData });
        const url = 'https://upload-speed-test-dot-monitor30-dot-oracle-services-vzla.uc.r.appspot.com/pingSpeedTest';
        return new Promise((resolve, reject) => {
            this._http.post(url, data, baseHeader).subscribe(
                () => {
                    const endTime = new Date().getTime();
                    const duration = (endTime - startTime) / 1000;
                    const bitsLoaded = fileSizeInBytes * 8;
                    const scale = this.getScale(bitsLoaded, duration);
                    resolve(`${scale.value.toFixed(2)} ${scale.speed}`);
                },
                (error) => { reject(error); }
            );
        });
    }

    private getScale(bitsLoaded, duration) {
        const bps = (bitsLoaded / duration);
        const kbps = (bps  / 1000);
        const mbps = (kbps / 1000);
        let value = 0;
        let speed = '--';
        if (mbps > 1) { value = mbps; speed = 'Mbs'; }
        else if (kbps > 1) { value = kbps; speed = 'kbs' }
        else { value = mbps; speed = 'bps' }
        return {value, speed};
    }

    private generateTestData(sizeInKmb) {
        const iterations = sizeInKmb * 1000; //get byte count
        let result = '';
        for (var index = 0; index < iterations; index++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      }
}
