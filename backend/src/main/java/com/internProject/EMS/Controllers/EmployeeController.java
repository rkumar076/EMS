package com.internProject.EMS.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import com.internProject.EMS.Model.Employee;
import com.internProject.EMS.Repository.EmployeeRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

// 🔥 PDF IMPORTS
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.*;
import com.itextpdf.layout.element.*;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    // ✅ GET ALL + FILTER + PAGINATION
    @GetMapping
    public Page<Employee> getEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String designation) {

        Pageable pageable = PageRequest.of(page, size);

        if (designation != null && !designation.isEmpty()) {
            return employeeRepository
                    .findByDesignationContainingIgnoreCase(designation, pageable);
        } else {
            return employeeRepository.findAll(pageable);
        }
    }

    // ✅ ADD
    @PostMapping
    public Employee addEmployee(@RequestBody Employee employee) {
        return employeeRepository.save(employee);
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable int id,
                                   @RequestBody Employee emp) {

        Employee existing = employeeRepository.findById(id).orElseThrow();

        existing.setEmpName(emp.getEmpName());
        existing.setDesignation(emp.getDesignation());
        existing.setEmpSalary(emp.getEmpSalary());
        existing.setPhoneNo(emp.getPhoneNo());
        existing.setPersonalEmail(emp.getPersonalEmail());
        existing.setOfficeEmail(emp.getOfficeEmail());

        return employeeRepository.save(existing);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable int id) {
        employeeRepository.deleteById(id);
    }

    // 🔥 PDF EXPORT
    @GetMapping("/pdf")
    public void generatePdf(HttpServletResponse response) throws Exception {

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=employees.pdf");

        List<Employee> employees = employeeRepository.findAll();

        PdfWriter writer = new PdfWriter(response.getOutputStream());
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // 🔥 Title
        document.add(new Paragraph("Employee List\n\n"));

        // 🔥 Table (6 columns)
        Table table = new Table(6);

        table.addCell("ID");
        table.addCell("Name");
        table.addCell("Department");
        table.addCell("Phone");
        table.addCell("Personal Email");
        table.addCell("Office Email");

        for (Employee emp : employees) {
            table.addCell(String.valueOf(emp.getEmpId()));
            table.addCell(emp.getEmpName());
            table.addCell(emp.getDesignation());
            table.addCell(emp.getPhoneNo());
            table.addCell(emp.getPersonalEmail());
            table.addCell(emp.getOfficeEmail());
        }

        document.add(table);
        document.close();
    }
}