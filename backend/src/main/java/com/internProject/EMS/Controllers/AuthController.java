package com.internProject.EMS.Controllers;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.internProject.EMS.DTO.AuthRequest;
import com.internProject.EMS.DTO.RegisterRequest;
import com.internProject.EMS.Model.User;
import com.internProject.EMS.Services.AuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    // SIGNUP
    @PostMapping("/signup")
public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

    User user = new User();
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPassword(request.getPassword());

    String result = authService.register(user);

    return ResponseEntity.ok(Map.of(
            "message", result
    ));
}

    // LOGIN
   @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody AuthRequest request) {

    String result = authService.login(request.getEmail(), request.getPassword());

    if (result.equals("Login success")) {
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", result
        ));
    } else {
        return ResponseEntity.status(401).body(Map.of(
                "status", "error",
                "message", result
        ));
    }
}
}