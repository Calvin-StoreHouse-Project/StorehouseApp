import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatTable, MatTableDataSource } from '@angular/material/table';

export interface CurrentInventory {
  name: string;
  quantity: number;
  units: string;
  dateReceived: Date;
  dateRemoval: Date;
  location: string;
  id: number;
  doc_id: string;
}

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.scss']
})
export class CurrentComponent implements OnInit {

  items: any[] = [];
  TABLE_DATA: CurrentInventory[] = [];
  tableData = new MatTableDataSource(this.TABLE_DATA);
  displayedColumns: string[] = ['name', 'quantity', 'units', 'dateReceived', 'dateTBR', 'location'];

  constructor(private database: AngularFirestore) { }

  ngOnInit(): void {
    var docRef = this.database.firestore.collection("Inventory")
    .get().then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {

        let item = doc.data();
        this.items.push({ doc_id: doc.id, ...item });

      });

      for(let i = 0; i < this.items.length; i++) {

        this.TABLE_DATA[i] = {
          name: this.items[i].name, quantity: this.items[i].quantity, units: this.items[i].units,
          dateReceived: this.items[i].dateReceived, dateRemoval: this.items[i].dateRemoval,
          location: this.items[i].location, id: i, doc_id: this.items[i].doc_id
        }
      }

      console.log(this.TABLE_DATA);

      this.tableData = new MatTableDataSource(this.TABLE_DATA);

    })
    .catch((error) => {
      console.error("error:", error);
    })

  }
}
