package com.cinemate.auth;

import com.cinemate.user.UserRepository;
import com.cinemate.user.User;
import com.cinemate.user.dtos.UserRequestDTO;
import com.cinemate.user.dtos.UserResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * registers an user
     * @param userDTO
     * @return ResponseEntity
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRequestDTO userDTO) {
        if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        User user = new User(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setJoinedAt(new Date());

        User savedUser = userRepository.save(user);
        UserResponseDTO responseDTO = new UserResponseDTO(savedUser);

        return ResponseEntity.ok(responseDTO);
    }

    /**
     * User login via username and password
     * @param userDTO
     * @return ResponseEntity
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserRequestDTO userDTO) {
        Optional<User> existingUserOpt = userRepository.findByUsername(userDTO.getUsername());

        if (existingUserOpt.isEmpty() ||
                !passwordEncoder.matches(userDTO.getPassword(), existingUserOpt.get().getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        User existingUser = existingUserOpt.get();

        String token = jwtUtil.generateToken(existingUser.getUsername());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", new UserResponseDTO(existingUser));

        return ResponseEntity.ok(response);
    }
}