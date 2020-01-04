import {Observable} from 'rxjs';

export abstract class FileUtils {
    static downloadFromDataURL(fileName: string, dataURL: string): void {
        if (!dataURL) {
            return;
        }
        this.contentToBlob(dataURL).subscribe(blob => {
            this.downloadFromBlob(blob, fileName);
        });
    }

    static downloadFromBlob(blob: Blob, fileName: string): void {
        const element = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.href = url;
        element.click();
        document.body.removeChild(element);
    }

    static contentToBlob(content: string): Observable<Blob> {
        return Observable.create((observer) => {
            const arr = content.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            observer.next(new Blob([u8arr], { type: mime }));
            observer.complete();
        });
    }
     static arrayBufferToBase64(buffer): string {
         let binary = '';
         const bytes = new Uint8Array(buffer);
         const len = bytes.byteLength;
         for (let i = 0; i < len; i++) {
             binary += String.fromCharCode(bytes[i]);
         }
         return btoa(binary);
     }

     static bufferToB64(data: any): string {
       // const bbFile = new Buffer(data.toString('ascii'), 'base64');
         const bbFile = new ArrayBuffer(data.data);
         const bb64 = this.arrayBufferToBase64(bbFile);
        const b64File = bb64.toString();
        return btoa(b64File);
     }
}
