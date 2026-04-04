package com.internProject.EMS.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.internProject.EMS.Model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    // ✅ FILTER + ACTIVE ONLY
    Page<Employee> findByDesignationContainingIgnoreCaseAndIsActiveTrue(String designation, Pageable pageable);

    // ✅ ONLY ACTIVE (pagination)
    Page<Employee> findByIsActiveTrue(Pageable pageable);

    // ✅ ONLY ACTIVE (list)
    List<Employee> findByIsActiveTrue();

    // ✅ ONLY INACTIVE (trash)
    List<Employee> findByIsActiveFalse();
}