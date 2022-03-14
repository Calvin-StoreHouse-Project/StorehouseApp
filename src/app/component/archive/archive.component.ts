import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { RedirectSnackBarComponent } from '../redirect-snack-bar/redirect-snack-bar.component';

export interface CurrentInventory {
  name: string;
  flagged: boolean;
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
  displayedColumns: string[] = ['name', 'quantity', 'units', 'dateReceived', 'dateTBR', 'location'];

  // variable for inventory items
  InventoryName: string = '';
  InventoryQuantity: number = 0;
  InventoryUnits: string = '';
  InventoryDateReceived?: Date;
  InventoryDateRemoval?: Date;
  InventoryLocation: string = '';
  InventoryFlagged: boolean = false;

  selectedItem: any;
  selectedRowIndex: number = -1;

  itemClicked: boolean = false;

  durationInSeconds: number = 3;


  constructor(private database: AngularFirestore, private snackbar: MatSnackBar,
    private authService: AuthService, private router: Router)
    { if(!this.authService.loggedIn) { this.router.navigate(['/home']); this.openRedirectSnackBar() } }


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
          name: this.items[i].name, flagged: this.items[i].flagged,
          quantity: this.items[i].quantity, units: this.items[i].units,
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
    this.InventoryFlagged = row.flagged;
  }

  highlight(row) {
    this.selectedRowIndex = row.id;
  }

  // https://www.angularjswiki.com/material/mat-table-filter/#step-1-add-a-search-input-box
  filter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.tableData.filter = value.trim().toLowerCase();
  }

  sortData(sort: Sort) {
    const data = this.TABLE_DATA.slice();
    if(!sort.active || sort.direction === '') {
      this.TABLE_DATA = data;
      return;
    }

    this.TABLE_DATA = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch(sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'quantity': return this.compare(a.quantity, b.quantity, isAsc);
        case 'units': return this.compare(a.units, b.units, isAsc);
        case 'dateReceived': return this.compare(a.dateReceived, b.dateReceived, isAsc);
        case 'dateRemoval': return this.compare(a.dateRemoval, b.dateRemoval, isAsc);
        case 'location': return this.compare(a.location, b.location, isAsc);
        default: return 0;
      }
    });

    this.tableData = new MatTableDataSource(this.TABLE_DATA);

  }

  compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  openRedirectSnackBar() {
    this.snackbar.openFromComponent(RedirectSnackBarComponent, {
      duration: this.durationInSeconds * 1000
    })
  }

}
