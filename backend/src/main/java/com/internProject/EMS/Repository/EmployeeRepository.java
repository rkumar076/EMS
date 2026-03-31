package com.internProject.EMS.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.internProject.EMS.Model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Integer>{

    // ✅ FILTER METHOD
   Page<Employee> findByDesignationContainingIgnoreCase(String designation, Pageable pageable);
}