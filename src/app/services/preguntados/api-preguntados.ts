import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiPreguntados {
  
  private apiString: string = 'https://restcountries.com/v3.1/all?fields=name,flags';

  constructor(private httpClient: HttpClient) { }

  getApiRequest(): Observable<any> {
    return this.httpClient.get<any>(this.apiString);
  }
}
