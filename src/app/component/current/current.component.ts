import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateSnackBarComponent } from '../update-snack-bar/update-snack-bar.component';
import { AddSnackBarComponent } from '../add-snack-bar/add-snack-bar.component';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { RedirectSnackBarComponent } from '../redirect-snack-bar/redirect-snack-bar.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  notes: string;
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
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.scss']
})
export class CurrentComponent implements OnInit {

  // variables for table
  items: any[] = [];
  expiredItems: any[] = [];
  reportingItems: any[] = [];
  sortedData: any;
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
  InventoryNotes: string = '';
  InventoryDestroyedInField: boolean = false;

  // for inventory transactions
  InventoryCustomer: string = '';
  InventoryTransferDate?: Date;
  oldQuantity: number = 0;

  custPopup: boolean = false;
  custErrorMessage: string = '';
  addErrorMessage: string = '';
  removeErrorMessage: string = '';

  selectedItem: any;
  selectedRowIndex: number = -1;

  itemClicked: boolean = false;
  expired: boolean = false;
  addItemBool: boolean = false;

  durationInSeconds: number = 3;

  isReadOnly: boolean = true;
  isReadOnlyQuantity: boolean = true;

  unenteredField: boolean = false;

  quantityPopup: boolean = false;
  addToPopup: boolean = false;
  removeFromPopup: boolean = false;
  removalQuantityPopup: boolean = false;
  addToQuantity: any = 0;
  removalQuantity: number = 0;

  quantityConstraintError: string = '';

  constructor(private database: AngularFirestore, private snackbar: MatSnackBar,
    public dialog: MatDialog, private authService: AuthService, private router: Router) {
      if(!this.authService.loggedIn) { this.router.navigate(['/home']); this.openRedirectSnackBar(); }
    }


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
        if (item['dateRemoval'].toDate() < today && item['quantity'] > 0) {
          this.expiredItems.push(item['name']);
          this.expired = true;
        }

      });

      for(let i = 0; i < this.items.length; i++) {

        this.TABLE_DATA[i] = {
          name: this.items[i].name, flagged: this.items[i].flagged, donor: this.items[i].donor,
          quantity: this.items[i].quantity, units: this.items[i].units,
          dateReceived: this.items[i].dateReceived.toDate(), dateRemoval: this.items[i].dateRemoval.toDate(),
          location: this.items[i].location, notes: this.items[i].notes,
          destroyedInField: this.items[i].destroyedInField, id: i, doc_id: this.items[i].doc_id
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
    this.selectedItem = row;
    this.oldQuantity = row.quantity
    this.InventoryCustomer = '';
    this.isReadOnly = true;

    this.InventoryName = row.name;
    this.InventoryDonor = row.donor;
    this.InventoryQuantity = parseInt(row.quantity);
    this.InventoryUnits = row.units;
    this.InventoryDateReceived = row.dateReceived;
    this.InventoryDateRemoval = row.dateRemoval;
    this.InventoryLocation = row.location;
    this.InventoryFlagged = row.flagged;
    this.InventoryNotes = row.notes;
    this.InventoryDestroyedInField = row.destroyedInField;
  }

  highlight(row) {
    this.selectedRowIndex = row.id;
  }

  addToQuantityFunc() {
    this.isReadOnly = true;
    this.addToPopup = true;
  }

  removeFromQuantity() {
    this.isReadOnlyQuantity = true;
    this.removalQuantityPopup = true;
  }

  getCustomer() {
    this.removalQuantityPopup = false;
    this.custPopup = true;
  }

  updateItemInfo() {
    this.isReadOnly = false;
  }

  updateQuantity() {

    // remove error messages
    this.addErrorMessage = '';
    this.removeErrorMessage = '';

    this.isReadOnlyQuantity = false;
    this.quantityPopup = true;
  }

  saveItemChanges() {
      this.updateInventory();
      this.isReadOnly = true;

      // update table
      for ( let i = 0; i < this.TABLE_DATA.length; i++ ) {
        if (this.TABLE_DATA[i].doc_id == this.selectedItem.doc_id) {
          this.TABLE_DATA[i].name = this.InventoryName;
          this.TABLE_DATA[i].donor = this.InventoryDonor;
          this.TABLE_DATA[i].quantity = this.InventoryQuantity;
          this.TABLE_DATA[i].units = this.InventoryUnits;
          this.TABLE_DATA[i].dateReceived = this.InventoryDateReceived.getTime();
          this.TABLE_DATA[i].dateRemoval = this.InventoryDateRemoval.getTime();
          this.TABLE_DATA[i].location = this.InventoryLocation;
          this.TABLE_DATA[i].notes = this.InventoryNotes;
          this.TABLE_DATA[i].flagged = this.InventoryFlagged;
          this.TABLE_DATA[i].destroyedInField = this.InventoryDestroyedInField;
        }
      }

      this.tableData = new MatTableDataSource(this.TABLE_DATA);

    }

  ensureCustomerEntered() {
    if(this.InventoryCustomer != '') {
      this.updateInventory();
      this.addTransaction();
    } else {
      this.custErrorMessage = "Please Enter a Customer.";
    }
  }

  checkQuantityConstraint() {

    this.removeErrorMessage = '';

    // check that quantity is less than current quantity and greater than zero
    if (isNaN(this.removalQuantity)) {
      this.removeErrorMessage = "Quantity must be a number. Try Again.";
    } else {
      if (this.InventoryQuantity < this.removalQuantity) {
        this.removeErrorMessage = "This amount is greater than the current item quantity. Try again."
      } else if (this.removalQuantity <= 0) {
        this.removeErrorMessage = "Quantity must be greater than zero."
      } else {
        this.quantityConstraintError = '';
        this.getCustomer();
      }
    }
  }

  ensureQuantityNotZeroAdd() {

    this.addErrorMessage = '';

    // check for number
    if (isNaN(this.addToQuantity)) {
      this.addErrorMessage = "Quantity must be a number. Try Again."
    } else {
      // check for positive number
      if (this.addToQuantity <= 0) {
        this.addErrorMessage = "Quantity must be greater than zero.";
      } else {
        this.finalAdd();
      }
    }
  }

  finalAdd() {
    this.updateInventory();
    this.addTransaction();
  }

  finalRemoval() {
    this.updateInventory();
    this.addTransaction();
  }

  updateInventory() {

    // calculate new quantity
    this.InventoryQuantity += parseInt(this.addToQuantity);
    this.InventoryQuantity -= this.removalQuantity;

    let doc_id = this.selectedItem.doc_id;
    this.database.collection("Inventory").doc(doc_id).update({
      name: this.InventoryName,
      donor: this.InventoryDonor,
      quantity: this.InventoryQuantity,
      units: this.InventoryUnits,
      dateReceived: this.InventoryDateReceived,
      dateRemoval: this.InventoryDateRemoval,
      location: this.InventoryLocation,
      flagged: this.InventoryFlagged,
      notes: this.InventoryNotes,
      destroyedInField: this.InventoryDestroyedInField
    });

    this.openUpdateSnackBar();

    console.log(this.TABLE_DATA);

    for( let i = 0; i < this.TABLE_DATA.length; i++ ) {
      if (doc_id == this.TABLE_DATA[i].doc_id) {
        this.TABLE_DATA[i].quantity = this.InventoryQuantity;
      }
    }

    console.log(this.TABLE_DATA);

    // this.items = [];
    // this.TABLE_DATA = [];

    // var today = new Date();

    // this.database.firestore.collection("Inventory")
    // .get().then((querySnapshot) => {
    //   querySnapshot.docs.forEach((doc) => {

    //     let item = doc.data();
    //     if (item['quantity'] != 0) {
    //       this.items.push({ doc_id: doc.id, ...item });
    //       if(item['name'] == 'Lightbulbs') {
    //         console.log(item['quantity']);
    //       }
    //     }

    //   });

      // console.log(this.items);

      // for(let i = 0; i < this.items.length; i++) {

      //   this.TABLE_DATA[i] = {
      //     name: this.items[i].name, flagged: this.items[i].flagged, donor: this.items[i].donor,
      //     quantity: this.items[i].quantity, units: this.items[i].units,
      //     dateReceived: this.items[i].dateReceived, dateRemoval: this.items[i].dateRemoval,
      //     location: this.items[i].location, notes: this.items[i].notes,
      //     destroyedInField: this.items[i].destroyedInField, id: i, doc_id: this.items[i].doc_id
      //   }
      // }

      // console.log(this.InventoryQuantity);

      this.tableData = new MatTableDataSource(this.TABLE_DATA);

      this.custPopup = false;
      this.addToPopup = false;
      this.isReadOnlyQuantity = true;
      this.addToQuantity = 0;
      this.removalQuantity = 0;

    // })
    // .catch((error) => {
    //   console.error("error:", error);
    // })
  }

  addTransaction() {

    // calculate quantity
    let quantityChange = this.InventoryQuantity - this.oldQuantity
    this.InventoryTransferDate = new Date();

    this.InventoryCustomer = '';

    // ADD CUSTOMER POPUP
    this.database.collection("Transactions").add({
      customer: this.InventoryCustomer,
      donor: this.InventoryDonor,
      item: this.InventoryName,
      quantity: quantityChange,
      units: this.InventoryUnits,
      date: this.InventoryTransferDate
    });

    this.oldQuantity = this.InventoryQuantity;

  }

  // customerPopup() {
  //   let quantityChange = this.oldQuantity - this.InventoryQuantity;
  //   if(quantityChange > 0) {
  //     this.custPopup = true;
  //   } else {
  //     this.updateInventory();
  //   }
  // }

  closeCustPopup() {
    this.custPopup = false;
  }

  openUpdateSnackBar() {
    this.snackbar.openFromComponent(UpdateSnackBarComponent, {
      duration: this.durationInSeconds * 1000
    })
  }

  openAddSnackBar() {
    this.snackbar.openFromComponent(AddSnackBarComponent, {
      duration: this.durationInSeconds * 1000
    })
  }

  openRedirectSnackBar() {
    this.snackbar.openFromComponent(RedirectSnackBarComponent, {
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

  addItem() {

    // ensure update card is cancelled
    this.itemClicked = false;

    // empty forms
    this.InventoryName = '';
    this.InventoryDonor = '';
    this.InventoryQuantity = 0;
    this.InventoryUnits = '';
    this.InventoryDateReceived = undefined;
    this.InventoryDateRemoval = undefined;
    this.InventoryLocation = '';
    this.InventoryNotes = '';

    // open add item card
    this.addItemBool = true;
  }

  ensureAllFields() {
    // make sure all fields are filled in
    if(this.InventoryName == '' || this.InventoryDonor == '' || this.InventoryQuantity == 0 ||
       this.InventoryUnits == '' || this.InventoryDateReceived == undefined || this.InventoryDateRemoval == undefined ||
       this.InventoryLocation == '') {
         this.unenteredField = true;
      }
      else {
        this.newItem();
      }
  }

  newItem() {
    this.addItemToInventory();
    this.newItemTransaction();
  }

  addItemToInventory() {

    // ensure notes is not undefined
    if (this.InventoryNotes === undefined) {
      this.InventoryNotes = '';
    }

    this.database.collection("Inventory").add({
      name: this.InventoryName,
      donor: this.InventoryDonor,
      quantity: this.InventoryQuantity,
      units: this.InventoryUnits,
      dateReceived: this.InventoryDateReceived,
      dateRemoval: this.InventoryDateRemoval,
      location: this.InventoryLocation,
      flagged: this.InventoryFlagged,
      notes: this.InventoryNotes,
      destroyedInField: false
    });

    console.log(this.InventoryNotes);

    // empty arrays
    this.items = [];
    this.TABLE_DATA = [];

    // get today's date
    var today = new Date();

    this.database.firestore.collection("Inventory")
    .get().then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {

        let item = doc.data();
        if (item['quantity'] != 0) {
          this.items.push({ doc_id: doc.id, ...item });
        }
        if (item['dateRemoval'].toDate() < today && item['quantity'] > 0) {
          this.expiredItems.push(item['name']);
          this.expired = true;
        }

      });

      for(let i = 0; i < this.items.length; i++) {

        this.TABLE_DATA[i] = {
          name: this.items[i].name, flagged: this.items[i].flagged, donor: this.items[i].donor,
          quantity: this.items[i].quantity, units: this.items[i].units,
          dateReceived: this.items[i].dateReceived.toDate(), dateRemoval: this.items[i].dateRemoval.toDate(),
          location: this.items[i].location, notes: this.items[i].notes,
          destroyedInField: this.items[i].destroyedInField, id: i, doc_id: this.items[i].doc_id
        }
      }
      console.log("3");

      this.tableData = new MatTableDataSource(this.TABLE_DATA);

      this.openAddSnackBar();

    })
    .catch((error) => {
      console.error("error:", error);
    })

  }

  newItemTransaction() {
    this.InventoryCustomer = '';

    this.database.collection("Transactions").add({
      customer: this.InventoryCustomer,
      donor: this.InventoryDonor,
      item: this.InventoryName,
      quantity: this.InventoryQuantity,
      units: this.InventoryUnits,
      date: this.InventoryTransferDate
    }).catch((error) => {
      console.error("error:", error);
    })
  }
  async generateReport(timePeriod){
    var today = new Date();
    var lastDate = new Date();
    lastDate.setDate(today.getDate() - timePeriod);

    await this.database.firestore.collection("Transactions")
    .get().then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {

        let item = doc.data();
        if (item['date'].toDate() > lastDate) {
          this.reportingItems.push({ doc_id: doc.id, ...item });
        }
      });
    }
    )
    .catch((error) => {
      console.error("error:", error);
    })
    for(let i = 0; i < this.reportingItems.length; i++) {
      this.TABLE_DATA2[i] = {
        item: this.reportingItems[i].item,
        quantity: this.reportingItems[i].quantity,
        donor: this.reportingItems[i].donor,
        units: this.reportingItems[i].units,
        customer: this.reportingItems[i].customer,
        date: this.reportingItems[i].date.toDate(),
      }
    }
  }

  async generatePdf(timePeriod, type){
    var text = "Transactions"
    if(type == 'transaction'){
      await this.generateReport(timePeriod);
      text = 'Recent Transactions';
    }
    else if (type == 'summary'){
      await this.generateSummaryReport(timePeriod);
      text = 'Transaction Summary By Item';
    }
    this.TABLE_DATA2.sort(this.objectComparisonCallback);
    console.log(this.TABLE_DATA2);
    const documentDefinition = { 
      content: [  
        // Previous configuration  
        {
              text: text,
              bold: true,
              fontSize: 20,
              alignment: 'center',
              margin: [0, 0, 0, 20]
            },
        {  
            table: {  
                headerRows: 1,  
                widths: ['20%', '20%', '20%', '7%', '13%', '20%'],
                // widths: ['20%', '20%', '20%', '20%', '20%'],  
                body: [  
                    [ {text: 'Item', style: 'header'},
                      {text: 'Donor', style: 'header'},
                      {text: 'Customer', style: 'header'},
                      {text: 'Qty', style: 'header'},
                      {text: 'Units', style: 'header'},
                      {text: 'Date', style: 'header'}],  
                    ...this.TABLE_DATA2.map(p => ([
                      {text: p.item, alignment: 'left'},
                      {text: p.donor, alignment: 'left'},
                      {text: p.customer, alignment: 'left'},
                      {text: p.quantity, alignment: 'center'},
                      {text: p.units, alignment: 'center'},  
                      {text: this.months[p.date.getMonth()] + " " + p.date.getDate() + ", " + p.date.getFullYear(), 
                          alignment: 'center'}])),  
                  ]
            }
        }  
      ], 
      styles: {
        header: {
          fontSize: 16, 
          bold: true, 
          alignment: 'center'
        }
      }
    };
    if (this.reportingItems.length > 0){
      pdfMake.createPdf(documentDefinition).open();
      this.reportingItems = [];
      this.TABLE_DATA2 = [];
    }
  }
  createReport(type){
    var tempInput = prompt("Enter number of days to view", "0");
    if (tempInput !==null){
      this.generatePdf(parseInt(tempInput), type);
    }
  }
  async generateSummaryReport(timePeriod){
    var today = new Date();
    var lastDate = new Date();
    lastDate.setDate(today.getDate() - timePeriod);

    await this.database.firestore.collection("Transactions")
    .get().then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {

        let item = doc.data();
        if (item['date'].toDate() > lastDate) {
          if (!this.reportingItems.find(el => el.item.toString() == item['item'])){
            this.reportingItems.push({ doc_id: doc.id, ...item });
          }
          else{
            for (var i=0; i < this.reportingItems.length; i++) {

              if (this.reportingItems[i].item == item['item']){
                this.reportingItems[i].quantity += item['quantity'];
              }
            }
          } 
        }
      });
    }
    )
    .catch((error) => {
      console.error("error:", error);
    })
    for(let i = 0; i < this.reportingItems.length; i++) {
      this.TABLE_DATA2[i] = {
        item: this.reportingItems[i].item,
        quantity: this.reportingItems[i].quantity,
        donor: this.reportingItems[i].donor,
        units: this.reportingItems[i].units,
        customer: this.reportingItems[i].customer,
        date: this.reportingItems[i].date.toDate(),
      }
    }
  }
  compareDates = (arrayItemA, arrayItemB) => {
    if (arrayItemA.date > arrayItemB.date) {
      return -1
    }
  
    if (arrayItemA.date < arrayItemB.date) {
      return 1
    }
  
    return 0
  }
  compareItems = (arrayItemA, arrayItemB) => {
    if (arrayItemA.item > arrayItemB.item) {
      return -1
    }
  
    if (arrayItemA.item < arrayItemB.item) {
      return 1
    }
  
    return 0
  }
  objectComparisonCallback = (arrayItemA, arrayItemB) => {
    // first sort by date
    const priceOutcome = this.compareDates(arrayItemA, arrayItemB)
    if (priceOutcome !== 0) {
      return priceOutcome
    }
    return this.compareItems(arrayItemA, arrayItemB);
  }
}
