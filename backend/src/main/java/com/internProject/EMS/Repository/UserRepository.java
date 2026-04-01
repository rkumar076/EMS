package com.internProject.EMS.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.internProject.EMS.Model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);
}