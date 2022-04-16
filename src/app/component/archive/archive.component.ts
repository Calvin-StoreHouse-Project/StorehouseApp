import { Component, OnInit, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { RedirectSnackBarComponent } from '../redirect-snack-bar/redirect-snack-bar.component';
import { DOCUMENT } from '@angular/common';
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
  InventoryDateReceived?: Date;
  InventoryDateRemoval?: Date;
  InventoryLocation: string = '';
  InventoryFlagged: boolean = false;
  InventoryDestroyedInField: boolean = false;

  selectedItem: any;
  selectedRowIndex: number = -1;

  itemClicked: boolean = false;

  durationInSeconds: number = 3;


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
          dateReceived: this.items[i].dateReceived, dateRemoval: this.items[i].dateRemoval,
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
    this.selectedItem = row;

    this.InventoryName = row.name;
    this.InventoryDonor = row.donor;
    this.InventoryQuantity = row.quantity;
    this.InventoryUnits = row.units;
    this.InventoryDateReceived = row.dateReceived.toDate();
    this.InventoryDateRemoval = row.dateRemoval.toDate();
    this.InventoryLocation = row.location;
    this.InventoryFlagged = row.flagged;
    this.InventoryDestroyedInField = row.destroyedInField;
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
    if(type == 'transaction'){
      await this.generateReport(timePeriod);
    }
    else if (type == 'summary'){
      await this.generateSummaryReport(timePeriod);
    }
    this.TABLE_DATA2.sort(this.objectComparisonCallback);
    console.log(this.TABLE_DATA2);
    const documentDefinition = { 
      content: [  
        // Previous configuration  
        {
              text: 'Recent Transactions',
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
