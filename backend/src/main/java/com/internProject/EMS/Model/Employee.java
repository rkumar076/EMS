 package com.internProject.EMS.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table (name="employees")

public class Employee {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    
    private int empId;
    private String empName;
    private String designation;
    private int empSalary;
    private String phoneNo;
    private String personalEmail;
    private String officeEmail;

     
}