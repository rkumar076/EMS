package com.internProject.EMS.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.internProject.EMS.Model.Employee;
import com.internProject.EMS.Repository.EmployeeRepository;

@RestController
@RequestMapping("/employees") // 🔥 IMPORTANT
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    // ✅ GET ALL + FILTER
    @GetMapping
    public List<Employee> getEmployees(
            @RequestParam(required = false) String designation) {

        if (designation != null) {
            return employeeRepository
                    .findByDesignationContainingIgnoreCase(designation);
        } else {
            return employeeRepository.findAll();
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
}