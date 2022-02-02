import { Component, OnInit } from '@angular/core';

export interface CurrentInventory {
  name: string;
  quantity: number;
  units: string;
  dateReceived: Date;
  dateTBR: Date;
  location: string;
}

const ELEMENT_DATA: CurrentInventory[] = [
  {name: "Pencils", quantity: 20, units: "boxes", dateReceived: new Date('01/18/2021'), dateTBR: new Date('07/28/2024'), location: "3"},
  {name: "Hand Sanitizer", quantity: 80, units: "boxes", dateReceived: new Date('01/18/2022'), dateTBR: new Date('09/28/2022'), location: "2"},
  {name: "Tissue Boxes", quantity: 150, units: "boxes", dateReceived: new Date('08/02/2020'), dateTBR: new Date('09/01/2024'), location: "1"},
  {name: "Erasers", quantity: 8, units: "boxes", dateReceived: new Date('01/25/2022'), dateTBR: new Date('10/26/2023'), location: "3"},
];

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.scss']
})
export class CurrentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  displayedColumns: string[] = ['name', 'quantity', 'units', 'dateReceived', 'dateTBR', 'location'];
  dataSource = ELEMENT_DATA;

}
