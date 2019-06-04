import { Injectable } from '@angular/core';
import { CastExpr } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  constructor( private http: HttpClient) { }
  public getCats(): Promise<any> {
     return this.http.get('assets/data.json').toPromise();
}
}
