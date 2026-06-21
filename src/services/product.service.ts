import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getAllPrds(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.apiUrl);
  }

  getPrdById(id: string): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`);
  }

  createPrd(prd: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(this.apiUrl, prd);
  }

  editPrd(id: string, updatedPrd: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.apiUrl}/${id}`, updatedPrd);
  }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/categories');
  }

  deletePrdById(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}