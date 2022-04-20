import { Component, OnInit, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, RouterLinkWithHref } from '@angular/router';
import { RedirectSnackBarComponent } from '../redirect-snack-bar/redirect-snack-bar.component';
import { DOCUMENT } from '@angular/common';
import { UpdateSnackBarComponent } from '../update-snack-bar/update-snack-bar.component';


export interface CurrentInventory {
  name: string;
  flagged: boolean;
  donor: string;
  quantity: number;
  units: string;
  dateReceived: Date;
  dateRemoval: Date;
  location: string;
  destroyedInField: boolean;
  id: number;
  doc_id: string;
}
export interface RecentTransactions {
  item: any;
  donor: string;
  quantity: number;
  units: string;
  customer: string;
  date: any;
}

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {

  // variables for table
  items: any[] = [];
  reportingItems: any[] = [];
  TABLE_DATA: CurrentInventory[] = [];
  TABLE_DATA2: RecentTransactions[] = [];
  tableData = new MatTableDataSource(this.TABLE_DATA);
  displayedColumns: string[] = ['name', 'donor', 'quantity', 'units', 'dateReceived', 'dateTBR', 'location'];
  months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // variable for inventory items
  InventoryName: string = '';
  InventoryDonor: string = '';
  InventoryQuantity: number = 0;
  InventoryUnits: string = '';
  InventoryDateReceived?: any;
  InventoryDateRemoval?: any;
  InventoryLocation: string = '';
  InventoryFlagged: boolean = false;
  InventoryDestroyedInField: boolean = false;
  doc_id: string = '';
  id: number = -1;

  selectedItem: any;
  selectedRowIndex: number = -1;

  itemClicked: boolean = false;
  QuantityIncreasePopup: boolean = false;
  quantityIncrease: number = 0;

  dateUpdatePopup: boolean = false;
  newRemovalDate?: any;
  dateErrorMsg: string = '';

  directionPopup: boolean = false;

  durationInSeconds: number = 3;

  quantityErrorMessage: string = '';


  constructor(private database: AngularFirestore, private snackbar: MatSnackBar,
    private authService: AuthService, private router: Router, @Inject(DOCUMENT) private dom: Document)
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
          name: this.items[i].name, flagged: this.items[i].flagged, donor: this.items[i].donor,
          quantity: this.items[i].quantity, units: this.items[i].units,
          dateReceived: this.items[i].dateReceived.toDate(), dateRemoval: this.items[i].dateRemoval.toDate(),
          location: this.items[i].location, destroyedInField: this.items[i].destroyedInField,
          id: i, doc_id: this.items[i].doc_id
        }
      }

      this.tableData = new MatTableDataSource(this.TABLE_DATA);

    })
    .catch((error) => {
      console.error("error:", error);
    })
  }

  // executed on table row click
  clicked(row) {

    // reset
    this.quantityIncrease = 0;
    this.quantityErrorMessage = '';
    this.dateErrorMsg = '';

    this.selectedItem = row;
    this.InventoryName = row.name;
    this.InventoryDonor = row.donor;
    this.InventoryQuantity = row.quantity;
    this.InventoryUnits = row.units;
    this.InventoryDateReceived = row.dateReceived;
    this.InventoryDateRemoval = row.dateRemoval;
    this.InventoryLocation = row.location;
    this.InventoryFlagged = row.flagged;
    this.InventoryDestroyedInField = row.destroyedInField;
    this.doc_id = row.doc_id;

    if (row.quantity > 0) {
      this.directionPopup = true;
    } else {
      this.QuantityIncreasePopup = true;
    }
  }

  // ensure quantity is legitimate
  checkQuantity() {

    if (isNaN(this.quantityIncrease)) {
      this.quantityErrorMessage = "Quantity must be a number. Try Again.";
    } else {
      if (this.quantityIncrease <= 0) {
        this.quantityErrorMessage = "Quantity must be greater than zero."
      } else {
        this.quantityErrorMessage = '';
        this.QuantityIncreasePopup = false;
        this.dateUpdatePopup = true;
      }
    }
  }

  // ensure date is legitimate
  checkDate() {

    if (this.newRemovalDate == null) {
      this.dateErrorMsg = "Please choose a date.";
    } else {
      if (this.newRemovalDate < this.InventoryDateReceived) {
        this.dateErrorMsg = "Removal Date must be before date received."
      } else {
        this.increment();
      }
    }
  }

  increment() {
    this.dateUpdatePopup = false;

    let today = new Date()

    // calculate new quantity
    let newQuantity = parseFloat(this.InventoryQuantity.toString()) + parseFloat(this.quantityIncrease.toString());

    // update table
    console.log(this.TABLE_DATA);
    this.TABLE_DATA[this.selectedItem.id].quantity = newQuantity;
    this.TABLE_DATA[this.selectedItem.id].dateReceived = today;
    this.TABLE_DATA[this.selectedItem.id].dateRemoval = this.newRemovalDate.getTime();


    // update inventory collection
    this.database.collection("Inventory").doc(this.doc_id)
    .update({
      quantity: newQuantity,
      dateReceived: today,
      dateRemoval: this.newRemovalDate
    });

    // add transaction to transaction collection
    this.database.collection("Transactions").add({
      customer: '',
      donor: this.InventoryDonor,
      item: this.InventoryName,
      quantity: newQuantity,
      units: this.InventoryUnits,
      date: today
    }).catch((error) => {
      console.error("error:", error);
    }).then(() => {
      this.openUpdateSnackBar();
    })

  }

  openUpdateSnackBar() {
    this.snackbar.openFromComponent(UpdateSnackBarComponent, {
      duration: this.durationInSeconds * 1000
    })
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
        case 'donor': return this.compare(a.donor, b.donor, isAsc);
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

  scrollToTop() {
    this.dom.body.scrollTop = 0;
    this.dom.documentElement.scrollTop = 0;
  }

}
