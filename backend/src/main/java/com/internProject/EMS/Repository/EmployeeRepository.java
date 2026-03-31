 package com.internProject.EMS.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.internProject.EMS.Model.Employee;
@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Integer>{

    
}