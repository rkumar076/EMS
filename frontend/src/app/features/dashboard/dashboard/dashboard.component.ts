import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private http: HttpClient) {}

  currentMonth = new Date().toLocaleString('default', { month: 'long' });

  // 🔥 FIXED (empId added)
  employees = Array.from({ length: 12 }, (_, i) => ({
    empId: i + 1,  // ✅ VERY IMPORTANT
    name: 'Employee ' + (i + 1),
    id: 'EMP10' + (i + 1),
    department: ['IT', 'HR', 'Finance', 'Sales'][i % 4],
    image: 'https://via.placeholder.com/100',
    month: this.currentMonth
  }));

  employeeOfMonth = {
    empId: 1, // ✅ ADD THIS
    name: 'Employee 1',
    id: 'EMP101',
    department: 'IT',
    image: 'https://via.placeholder.com/120',
    month: this.currentMonth
  };

  selectedMonth: string = this.currentMonth;

  // 📸 Upload image (FIXED 🔥)
  onImageUpload(event: any, emp: any) {

    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    console.log("🔥 emp:", emp); // debug

    this.http.post(`http://localhost:8080/employees/upload/${emp.empId}`, formData)
      .subscribe({
        next: (res: any) => {

          console.log("🔥 Response:", res);

          // 🔥 FORCE refresh image (cache fix)
          emp.image = res.image + '?' + new Date().getTime();

        },
        error: (err) => {
          console.log("❌ Error:", err);
        }
      });
  }

  // 📸 Month image (local preview)
  onMonthImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.employeeOfMonth.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // ⭐ Set Employee of Month
  setEmployeeOfMonth(emp: any) {
    this.employeeOfMonth = {
      ...emp,
      month: this.selectedMonth
    };
  }
}