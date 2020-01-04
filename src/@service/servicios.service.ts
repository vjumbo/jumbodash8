import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Utilities} from '@utilities/utilities';
import {Observable} from 'rxjs';

@Injectable()
export class RequestServices {
    headers: HttpHeaders;

  constructor(
      private _httpClient: HttpClient
  ) {}

  private setHeaders(): void {
      this.headers = new HttpHeaders(
          {
              'token': Utilities.currentUser.getToken().token,
              'username': Utilities.currentUser.getToken().username
          }
      );
  }

  reqGet(url: string): Observable<Object> {
      this.setHeaders();
      return this._httpClient.get(url, {headers: this.headers});
  }

  reqPut(url: string, data: any): Observable<Object> {
      this.setHeaders();
      return this._httpClient.put(url, data, {headers: this.headers});
  }

  reqPost(url: string, data: any): Observable<Object> {
      this.setHeaders();
      return this._httpClient.post(url, data, {headers: this.headers});
  }

  reqDel(url: string): Observable<Object> {
      this.setHeaders();
      return this._httpClient.delete(url, {headers: this.headers});
  }
}
