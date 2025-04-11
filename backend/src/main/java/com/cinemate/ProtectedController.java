package com.cinemate;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProtectedController {

    @GetMapping("/api/protected")
    public String secretMessage() {
        return "This is a protected route! 🎉";
    }
}
