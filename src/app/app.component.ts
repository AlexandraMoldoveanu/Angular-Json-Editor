import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'editor';
  dataObject: any;
  constructor( ) {  }
   ngOnInit() {
     this.dataObject = {
       name: 'Aluna',
       age: 2,
       cool: true,
       owners: [
         {name: 'Ale', age: 30},
         {name: 'Stefan', age: 30}
       ],
       eats: ['toast', 'pufuleti', 'hair'],
       
     };
   }
}
