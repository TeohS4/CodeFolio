import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PAGES_IMPORTS } from '../pages.imports';
import { Employee } from '../../core/interfaces/employee';
import { EmployeeService } from '../../core/services/employee-service/employee';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '../../core/services/alert-service/alert';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [...PAGES_IMPORTS],
  templateUrl: './employee.html',
  styleUrl: './employee.scss',
})
export class EmployeeComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  currentDialog?: MatDialogRef<any>;
  employees: Employee[] = [];
  filtered: Employee[] = [];
  model: Employee = this.emptyModel();

  search = '';
  departmentFilter = '';
  statusFilter = '';
  sortColumn: keyof Employee = 'name';
  sortAsc = true;

  constructor(
    private service: EmployeeService,
    private dialog: MatDialog,
    private alert: AlertService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.load();
  }

  emptyModel(): Employee {
    return {
      id: 0,
      name: '',
      jobTitle: '',
      department: '',
      status: 'Active',
      joinDate: new Date(),
      salary: 0
    };
  }

  load() {
    this.service.getAll().subscribe(res => {
      this.employees = res;
      this.applyFilter();
      this.cdr.detectChanges();
    });
  }

  applyFilter() {
    let data = [...this.employees];

    if (this.search) {
      const s = this.search.toLowerCase();
      data = data.filter(x =>
        x.name.toLowerCase().includes(s) ||
        x.jobTitle.toLowerCase().includes(s)
      );
    }

    if (this.departmentFilter)
      data = data.filter(x => x.department === this.departmentFilter);

    if (this.statusFilter)
      data = data.filter(x => x.status === this.statusFilter);

    data.sort((a: any, b: any) => {
      const A = a[this.sortColumn];
      const B = b[this.sortColumn];
      if (A < B) return this.sortAsc ? -1 : 1;
      if (A > B) return this.sortAsc ? 1 : -1;
      return 0;
    });

    this.filtered = [...data];
    this.cdr.detectChanges();
  }

  sort(col: keyof Employee) {
    this.sortColumn === col ? this.sortAsc = !this.sortAsc : (this.sortColumn = col, this.sortAsc = true);
    this.applyFilter();
  }

  openDialog(emp?: Employee) {
    if (emp) {
      const dateObj = new Date(emp.joinDate);
      if (dateObj.getFullYear() < 100) {
        dateObj.setFullYear(dateObj.getFullYear() + 2000);
      }

      this.model = {
        ...emp,
        joinDate: dateObj
      };
    } else {
      this.model = this.emptyModel();
    }

    this.currentDialog = this.dialog.open(this.dialogTemplate, {
      width: '450px'
    });
  }

  save() {
    const req = this.model.id
      ? this.service.update(this.model.id, this.model)
      : this.service.create(this.model);

    req.subscribe({
      next: () => {
        this.alert.success(this.model.id ? 'Updated' : 'Created');
        this.currentDialog?.close();
        this.load();
      },
      error: () => {
        this.alert.error('Save failed');
        this.cdr.detectChanges();
      }
    });
  }

  delete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      background: '#1e1e1e',
      color: '#e0e0e0',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#444',
      confirmButtonText: 'Yes',
      iconColor: '#ff9800'
    }).then(res => {
      if (res.isConfirmed) {
        this.service.delete(id).subscribe(() => {
          this.alert.success('Deleted');
          this.load();
        });
      }
      this.cdr.detectChanges();
    });
  }

  exportExcel() {
    const data = this.filtered.map(e => ({
      'Employee Name': e.name,
      'Job Position': e.jobTitle,
      'Department': e.department,
      'Date Joined': new Date(e.joinDate).toLocaleDateString('en-GB'),
      'Salary (RM)': e.salary,
      'Current Status': e.status
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Employee Records');
    XLSX.writeFile(wb, 'Employee_Records.xlsx');
  }

  exportPDF() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('Employee Records', pageWidth / 2, 15, { align: 'center' });
    // date
    const rows = this.filtered.map(e => [
      e.name,
      e.jobTitle,
      e.department,
      new Date(e.joinDate).toLocaleDateString('en-GB'),
      `RM ${e.salary}`,
      e.status
    ]);

    autoTable(doc, {
      startY: 25,
      head: [['Name', 'Job Title', 'Dept', 'Joined', 'Salary', 'Status']],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [30, 30, 30], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 3 }
    });

    doc.save('Employee_Records.pdf');
  }
}