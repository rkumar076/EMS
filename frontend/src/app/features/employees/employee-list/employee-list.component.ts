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

  selectedEmployee: any = null;

  showForm = false;
  isEdit = false;

  // 🔥 PAGINATION
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

  // 🔥 FILTER TRACK
  currentFilter: string = 'All';

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
  }

  // 🔥 GET WITH PAGINATION
  getEmployees() {

    let url = `${this.apiUrl}?page=${this.currentPage}&size=${this.pageSize}`;

    // 🔥 apply filter if not ALL
    if (this.currentFilter !== 'All') {
      const map: any = {
        'HR': 'HR',
        'IT': 'Developer',
        'Finance': 'Designer',
        'Operations': 'Manager',
        'Sales': 'Sales',
        'Admin': 'Admin'
      };

      const value = map[this.currentFilter];
      url += `&designation=${value}`;
    }

    this.http.get<any>(url).subscribe({
      next: (res) => {
        console.log('API RESPONSE:', res);

        this.filteredEmployees = res.content; // 🔥 MAIN FIX
        this.totalPages = res.totalPages;

        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // 🔥 FILTER
  filterByDept(dept: string) {
    this.currentFilter = dept;
    this.currentPage = 0; // 🔥 reset page
    this.getEmployees();
  }

  // 🎯 SELECT
  selectEmployee(emp: any) {
    this.selectedEmployee = emp;
  }

  // ➕ ADD
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

  // ✏️ UPDATE
openUpdate() {
  if (!this.selectedEmployee) {
    alert('Select employee first');
    return;
  }

  this.isEdit = true;

  // 🔥 IMPORTANT: data fill in form
  this.formData = { ...this.selectedEmployee };

  this.showForm = true;
}

  // 💾 SAVE
 saveEmployee() {

  if (this.isEdit) {

    this.http.put(`${this.apiUrl}/${this.formData.empId}`, this.formData)
      .subscribe({
        next: () => {
          alert('Updated ✅');
          this.getEmployees();
          this.closeForm();
        }
      });

  } else {

    this.http.post(this.apiUrl, this.formData)
      .subscribe({
        next: () => {
          alert('Added ✅');
          this.getEmployees();
          this.closeForm();
        }
      });
  }
}

  // ❌ DELETE
deleteEmployee() {
  if (!this.selectedEmployee) {
    alert('Select employee first');
    return;
  }

  const confirmDelete = confirm('Delete this employee?');

  if (confirmDelete) {
    this.http.delete(`${this.apiUrl}/${this.selectedEmployee.empId}`)
      .subscribe({
        next: () => {
          alert('Deleted ❌');
          this.getEmployees();
          this.selectedEmployee = null;
        }
      });
  }
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

  // 🔥 PAGINATION FUNCTIONS
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

  // 🔥 trackBy
  trackById(index: number, emp: any) {
    return emp.empId;
  }
}