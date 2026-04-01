package com.internProject.EMS.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.internProject.EMS.Model.User;
import com.internProject.EMS.Repository.UserRepository;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // REGISTER
    public String register(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "User already exists";
        }

        userRepository.save(user);
        return "User registered successfully";
    }

    // LOGIN
    public String login(String email, String password) {

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            if (user.get().getPassword().equals(password)) {
                return "Login success";
            } else {
                return "Invalid password";
            }
        }

        return "User not found";
    }
}