import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PAGES_IMPORTS } from '../../pages.imports';
import { CustomerService } from '../../../core/services/erp/customer-service/customer-service';
import { AlertService } from '../../../core/services/alert-service/alert';
import { Customer } from '../../../core/interfaces/customer.intertface';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [...PAGES_IMPORTS],
  templateUrl: './customer.html',
  styleUrls: ['./customer.scss'],
})
export class CustomerComponent implements OnInit {
  @ViewChild('customerDialog') customerDialog!: TemplateRef<any>;

  currentDialog?: MatDialogRef<any>;
  customers: Customer[] = [];
  model: Customer = this.emptyModel();
  form!: FormGroup;

  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'address', 'actions'];

  constructor(
    private service: CustomerService,
    private dialog: MatDialog,
    private alert: AlertService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.load();
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  emptyModel(): Customer {
    return {
      id: 0,
      name: '',
      email: '',
      phone: '',
      address: ''
    };
  }

  load() {
    this.service.getAll().subscribe({
      next: (res: Customer[]) => {
        this.customers = res.map(c => ({
          id: c.id ?? (c as any).Id,
          name: c.name ?? (c as any).Name,
          email: c.email ?? (c as any).Email,
          phone: c.phone ?? (c as any).Phone,
          address: c.address ?? (c as any).Address,
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.alert.error('Error', 'Failed to load customers');
        this.cdr.detectChanges();
      },
    });
  }


  openDialog(customer?: Customer) {
    if (customer) {
      this.model = { ...customer };
      this.form.patchValue(this.model);
    } else {
      this.model = this.emptyModel();
      this.form.reset();
    }

    this.currentDialog = this.dialog.open(this.customerDialog, { width: '450px' });
    this.cdr.detectChanges();
  }

  save() {
    if (this.form.invalid) return;

    const data: Customer = { ...this.model, ...this.form.value };

    const req = data.id
      ? this.service.update(data.id, data)
      : this.service.create(data);

    req.subscribe({
      next: () => {
        this.alert.success(data.id ? 'Updated' : 'Created');
        this.currentDialog?.close();
        this.load();
        this.cdr.detectChanges();
      },
      error: () => {
        this.alert.error('Save failed');
        this.cdr.detectChanges();
      },
    });
  }

  delete(id: number) {
    if (confirm('Delete this customer?')) {
      this.service.delete(id).subscribe({
        next: () => {
          this.alert.success('Deleted');
          this.load();
          this.cdr.detectChanges();
        },
        error: () => {
          this.alert.error('Delete failed');
          this.cdr.detectChanges();
        },
      });
    }
  }
}
