import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateSnackBarComponent } from '../update-snack-bar/update-snack-bar.component';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';



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

  // variables for table
  items: any[] = [];
  expiredItems: any[] = [];
  sortedData: any;
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
  expired: boolean = false;

  durationInSeconds: number = 3;


  constructor(private database: AngularFirestore, private snackbar: MatSnackBar, public dialog: MatDialog) { }


  // executed on page load
  ngOnInit(): void {

    // get today's date
    var today = new Date();

    this.database.firestore.collection("Inventory")
    .get().then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {

        let item = doc.data();
        if (item['quantity'] != 0) {
          this.items.push({ doc_id: doc.id, ...item });
        }
        if (item['dateRemoval'].toDate() < today) {
          this.expiredItems.push(item['name']);
          this.expired = true;
        }

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

  updateInventory() {
    let doc_id = this.selectedItem.doc_id;
    this.database.collection("Inventory").doc(doc_id).update({
      name: this.InventoryName,
      quantity: this.InventoryQuantity,
      units: this.InventoryUnits,
      dateReceived: this.InventoryDateReceived,
      dateRemoval: this.InventoryDateRemoval,
      location: this.InventoryLocation
    });

    this.openSnackBar();

    this.items = [];
    this.TABLE_DATA = [];

    var today = new Date();

    this.database.firestore.collection("Inventory")
    .get().then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {

        let item = doc.data();
        if (item['quantity'] != 0) {
          this.items.push({ doc_id: doc.id, ...item });
        }
        if (item['dateRemoval'].toDate() < today) {
          this.expiredItems.push(item['name']);
          this.expired = true;
        }

      });

      for(let i = 0; i < this.items.length; i++) {

        this.TABLE_DATA[i] = {
          name: this.items[i].name, quantity: this.items[i].quantity, units: this.items[i].units,
          dateReceived: this.items[i].dateReceived, dateRemoval: this.items[i].dateRemoval,
          location: this.items[i].location, id: i, doc_id: this.items[i].doc_id
        }
      }

      this.tableData = new MatTableDataSource(this.TABLE_DATA);

    })
    .catch((error) => {
      console.error("error:", error);
    })

  }

  openSnackBar() {
    this.snackbar.openFromComponent(UpdateSnackBarComponent, {
      duration: this.durationInSeconds * 1000
    })
  }

  // https://www.angularjswiki.com/material/mat-table-filter/#step-1-add-a-search-input-box
  filter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.tableData.filter = value.trim().toLowerCase();
  }

  closeDialog() {
    this.expired = false;
  }

}
