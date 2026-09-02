package vn.edu.crs.registration_service.controller;

import vn.edu.crs.registration_service.dto.RegistrationRequestDTO;
import vn.edu.crs.registration_service.entity.Registration;
import vn.edu.crs.registration_service.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Registration register(@Valid @RequestBody RegistrationRequestDTO dto) {
        return registrationService.register(dto);
    }

    @GetMapping("/my")
    public List<Registration> getMyRegistrations(Authentication authentication) {
        Long studentId = (Long) authentication.getCredentials();
        return registrationService.getMyRegistrations(studentId);
    }

    @GetMapping("/student/{studentId}")
    public List<Registration> getByStudentId(@PathVariable Long studentId) {
        return registrationService.getByStudentId(studentId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancel(@PathVariable Long id) {
        registrationService.cancel(id);
    }
}
