import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UpdateSnackBarComponent } from '../update-snack-bar/update-snack-bar.component';

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
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {

  // variables for table
  items: any[] = [];
  TABLE_DATA: CurrentInventory[] = [];
  tableData = new MatTableDataSource(this.TABLE_DATA);
  displayedColumns: string[] = ['name', 'quantity', 'units', 'dateReceived', 'dateTBR', 'location', 'edit'];

  // variable for inventory items
  InventoryName: string = '';
  InventoryQuantity: number = 0;
  InventoryUnits: string = '';
  InventoryDateReceived?: Date;
  InventoryDateRemoval?: Date;
  InventoryLocation: string = '';

  selectedItem: any;
  selectedRowIndex: number = -1;

  itemClicked: boolean = false;

  durationInSeconds: number = 3;


  constructor(private database: AngularFirestore, private snackbar: MatSnackBar) { }


  // executed on page load
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

  // executed on table row click
  clicked(row) {
    this.selectedItem = row;

    this.InventoryName = row.name;
    this.InventoryQuantity = row.quantity;
    this.InventoryUnits = row.units;
    this.InventoryDateReceived = row.dateReceived.toDate();
    this.InventoryDateRemoval = row.dateRemoval.toDate();
    this.InventoryLocation = row.location;
  }

  highlight(row) {
    this.selectedRowIndex = row.id;
  }

  // https://www.angularjswiki.com/material/mat-table-filter/#step-1-add-a-search-input-box
  filter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.tableData.filter = value.trim().toLowerCase();
  }

}
