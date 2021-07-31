/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'vidgrab2-extractors',
  templateUrl: './extractors.component.html',
  styleUrls: ['./extractors.component.scss']
})
export class ExtractorsComponent implements OnInit {

  extractors$ = this.http.get<{extractors: string[]}>('/api/extractors').pipe(map(e => e.extractors));
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Does a thing
  }

}
