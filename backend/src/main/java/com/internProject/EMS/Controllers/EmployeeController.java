package com.internProject.EMS.Controllers;

import java.util.List;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.internProject.EMS.Model.Employee;
import com.internProject.EMS.Repository.EmployeeRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

// PDF
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.*;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.element.Table;

// Excel
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    // ✅ GET ALL (ONLY ACTIVE) + FILTER + PAGINATION
@GetMapping
public Page<Employee> getEmployees(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String designation) {

    Pageable pageable = PageRequest.of(page, size);

    // 🔥 SAFE CHECK (important)
    if (designation != null && !designation.trim().isEmpty()) {

        String search = designation.trim(); // remove extra spaces

        return employeeRepository
                .findByDesignationContainingIgnoreCaseAndIsActiveTrue(search, pageable);
    }

    return employeeRepository.findByIsActiveTrue(pageable);
}
    // ✅ GET INACTIVE EMPLOYEES
    @GetMapping("/inactive")
    public List<Employee> getInactiveEmployees() {
        return employeeRepository.findByIsActiveFalse();
    }

    // ✅ ADD (DEFAULT ACTIVE)
    @PostMapping
    public Employee addEmployee(@RequestBody Employee employee) {
        employee.setIsActive(true); // ensure active
        return employeeRepository.save(employee);
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable int id,
                                   @RequestBody Employee emp) {

        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        existing.setEmpName(emp.getEmpName());
        existing.setDesignation(emp.getDesignation());
        existing.setEmpSalary(emp.getEmpSalary());
        existing.setPhoneNo(emp.getPhoneNo());
        existing.setPersonalEmail(emp.getPersonalEmail());
        existing.setOfficeEmail(emp.getOfficeEmail());

        return employeeRepository.save(existing);
    }

    // ✅ SOFT DELETE (IMPORTANT 🔥)
    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable int id) {

        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        emp.setIsActive(false); // 👈 soft delete
        employeeRepository.save(emp);
    }

    // ✅ RESTORE EMPLOYEE (BONUS 🔥)
    @PutMapping("/restore/{id}")
    public void restoreEmployee(@PathVariable int id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        emp.setIsActive(true);
        employeeRepository.save(emp);
    }

    // 🔥 PDF EXPORT (ONLY ACTIVE)
   @GetMapping("/pdf")
public void generatePdf(HttpServletResponse response) {

    try {

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=employees.pdf");

        List<Employee> employees = employeeRepository.findByIsActiveTrue();

        PdfWriter writer = new PdfWriter(response.getOutputStream());
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("Employee List\n\n"));

        // 🔥 FIXED TABLE
        float[] columnWidths = {1, 3, 3, 3, 4, 4};
        Table table = new Table(columnWidths);

        table.addCell("ID");
        table.addCell("Name");
        table.addCell("Department");
        table.addCell("Phone");
        table.addCell("Personal Email");
        table.addCell("Office Email");

        for (Employee emp : employees) {

            table.addCell(String.valueOf(emp.getEmpId()));
            table.addCell(emp.getEmpName() != null ? emp.getEmpName() : "");
            table.addCell(emp.getDesignation() != null ? emp.getDesignation() : "");
            table.addCell(emp.getPhoneNo() != null ? emp.getPhoneNo() : "");
            table.addCell(emp.getPersonalEmail() != null ? emp.getPersonalEmail() : "");
            table.addCell(emp.getOfficeEmail() != null ? emp.getOfficeEmail() : "");
        }

        document.add(table);
        document.close();

    } catch (Exception e) {
        e.printStackTrace(); // 🔥 VERY IMPORTANT
    }
}
    // 🔥 EXCEL EXPORT (ONLY ACTIVE)
    @GetMapping("/excel")
    public void exportToExcel(HttpServletResponse response) throws Exception {

        List<Employee> employees = employeeRepository.findByIsActiveTrue();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Employees");

        Row headerRow = sheet.createRow(0);
        String[] columns = {"ID", "Name", "Department", "Phone", "Personal Email", "Office Email"};

        for (int i = 0; i < columns.length; i++) {
            headerRow.createCell(i).setCellValue(columns[i]);
        }

        int rowNum = 1;
        for (Employee emp : employees) {
            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(emp.getEmpId());
            row.createCell(1).setCellValue(emp.getEmpName());
            row.createCell(2).setCellValue(emp.getDesignation());
            row.createCell(3).setCellValue(emp.getPhoneNo());
            row.createCell(4).setCellValue(emp.getPersonalEmail());
            row.createCell(5).setCellValue(emp.getOfficeEmail());
        }

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=employees.xlsx");

        workbook.write(response.getOutputStream());
        workbook.close();
    }

    // ✅ IMAGE UPLOAD
    @PostMapping("/upload/{id}")
    public Employee uploadImage(
            @PathVariable int id,
            @RequestParam("file") MultipartFile file) throws Exception {

        Employee emp = employeeRepository.findById(id).orElseThrow();

        String uploadDir = "uploads/";
        File folder = new File(uploadDir);

        if (!folder.exists()) {
            folder.mkdir();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Files.copy(
                file.getInputStream(),
                Paths.get(uploadDir + fileName),
                java.nio.file.StandardCopyOption.REPLACE_EXISTING
        );

        String imageUrl = "http://localhost:8080/uploads/" + fileName;

        emp.setImage(imageUrl);

        return employeeRepository.save(emp);
    }
}