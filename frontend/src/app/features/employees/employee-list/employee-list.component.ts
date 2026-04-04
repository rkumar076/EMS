import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  apiUrl = 'http://localhost:8080/employees';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  employees: any[] = [];
  filteredEmployees: any[] = [];
  departments: string[] = []; // 🔥 dynamic dept

  selectedEmployee: any = null;

  showForm = false;
  isEdit = false;

  // 🔥 PAGINATION
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

  // 🔥 FILTER
  currentFilter: string = 'All';
  currentStatus: string = 'active'; // active | inactive

  formData: any = {
    empId: 0,
    empName: '',
    designation: '',
    empSalary: 0,
    phoneNo: '',
    personalEmail: '',
    officeEmail: ''
  };

  ngOnInit() {
    this.getEmployees();
    this.loadDepartments(); // 🔥 auto dept load
  }

  // ============================
  // 🔥 MAIN DATA LOAD
  // ============================
  getEmployees() {

  // 🔴 INACTIVE MODE
  if (this.currentStatus === 'inactive') {

    this.http.get<any>(`${this.apiUrl}/inactive`).subscribe({
      next: (res) => {

        let data = res || [];

        // 🔥 APPLY DEPT FILTER HERE ALSO
        if (this.currentFilter !== 'All') {
          data = data.filter((e: any) =>
            e.designation?.toLowerCase().includes(this.currentFilter.toLowerCase())
          );
        }

        this.filteredEmployees = data;
        this.totalPages = 1;
        this.cdr.detectChanges();
      }
    });

    return;
  }

  // 🟢 ACTIVE MODE
  let url = `${this.apiUrl}?page=${this.currentPage}&size=${this.pageSize}`;

  // 🔥 MOST IMPORTANT FIX
  if (this.currentFilter !== 'All') {
    url += `&designation=${encodeURIComponent(this.currentFilter)}`;
  }

  console.log("FINAL URL:", url); // 👈 CHECK THIS

  this.http.get<any>(url).subscribe({
    next: (res) => {
      this.filteredEmployees = res.content || [];
      this.totalPages = res.totalPages;
      this.cdr.detectChanges();
    }
  });
}
  // ============================
  // 🔥 LOAD DEPARTMENTS (AUTO)
  // ============================
 loadDepartments() {
  this.http.get<any>(`${this.apiUrl}?page=0&size=100`).subscribe(res => {

    const data = res.content || [];

    const unique = Array.from(
      new Set(data.map((e: any) => e.designation))
    ) as string[];

    this.departments = unique;
  });
}

  // ============================
  // 🔥 STATUS FILTER
  // ============================
  loadAll() {
    this.currentStatus = 'active';
    this.currentFilter = 'All';
    this.currentPage = 0;
    this.getEmployees();
  }

  loadActive() {
    this.currentStatus = 'active';
    this.currentPage = 0;
    this.getEmployees();
  }

  loadInactive() {
    this.currentStatus = 'inactive';
    this.currentPage = 0;
    this.getEmployees();
  }

  // ============================
  // 🔥 DEPT FILTER
  // ============================
filterByDept(dept: string) {
  console.log("CLICKED DEPT:", dept); // debug

  this.currentFilter = dept;
  this.currentStatus = 'active'; // 👈 IMPORTANT (reset inactive)
  this.currentPage = 0;

  this.getEmployees();
}
  // ============================
  // 🎯 SELECT
  // ============================
  selectEmployee(emp: any) {
    this.selectedEmployee = emp;
  }

  // ============================
  // ➕ ADD
  // ============================
  openAdd() {
    this.isEdit = false;
    this.formData = {
      empId: 0,
      empName: '',
      designation: '',
      empSalary: 0,
      phoneNo: '',
      personalEmail: '',
      officeEmail: ''
    };
    this.showForm = true;
  }

  // ============================
  // ✏️ UPDATE
  // ============================
  openUpdate() {
    if (!this.selectedEmployee) {
      alert('Select employee first');
      return;
    }

    this.isEdit = true;
    this.formData = { ...this.selectedEmployee };
    this.showForm = true;
  }

  // ============================
  // 💾 SAVE
  // ============================
  saveEmployee() {

    if (this.isEdit) {
      this.http.put(`${this.apiUrl}/${this.formData.empId}`, this.formData)
        .subscribe(() => {
          alert('Updated ✅');
          this.getEmployees();
          this.closeForm();
        });
    } else {
      this.http.post(this.apiUrl, this.formData)
        .subscribe(() => {
          alert('Added ✅');
          this.getEmployees();
          this.closeForm();
        });
    }
  }

  // ============================
  // ❌ DELETE (SOFT)
  // ============================
  deleteEmployee() {
    if (!this.selectedEmployee) {
      alert('Select employee first');
      return;
    }

    if (confirm('Move to inactive?')) {
      this.http.delete(`${this.apiUrl}/${this.selectedEmployee.empId}`)
        .subscribe(() => {
          alert('Moved to inactive ❌');
          this.getEmployees();
          this.selectedEmployee = null;
        });
    }
  }

  // ============================
  // 🔄 RESTORE
  // ============================
  restoreEmployee() {
    if (!this.selectedEmployee) {
      alert('Select employee first');
      return;
    }

    this.http.put(`${this.apiUrl}/restore/${this.selectedEmployee.empId}`, {})
      .subscribe(() => {
        alert('Restored ✅');
        this.getEmployees();
        this.selectedEmployee = null;
      });
  }

  closeForm() {
    this.showForm = false;
  }

  exportExcel() {
    window.open(`${this.apiUrl}/excel`, '_blank');
  }

  exportPDF() {
    window.open(`${this.apiUrl}/pdf`, '_blank');
  }

  // ============================
  // 🔥 PAGINATION
  // ============================
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getEmployees();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getEmployees();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.getEmployees();
  }

  trackById(index: number, emp: any) {
    return emp.empId;
  }
}