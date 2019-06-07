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
       age: 3,
       cool: true,
       dateOfBirth: '2016-08-01',
       id: '9011a22b-29b7-b5f6-5633-b2290486ce69',
       owners: [
         {name: 'Ale', age: 30},
         {name: 'Stefan', age: 30}
       ],
       eats: ['toast', 'pufuleti', 'hair'],
       likes: {
         activities: [ 'playCatch', 'drink my water', 'washing up'],
         beings: [ 'humans', 'insects'],
         favoriteHuman: { name: 'S', motive: 'unknown'}
       }
     };
   }
}
