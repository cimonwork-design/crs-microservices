package vn.edu.crs.registration_service.service;

import vn.edu.crs.registration_service.client.CourseClient;
import vn.edu.crs.registration_service.dto.RegistrationRequestDTO;
import vn.edu.crs.registration_service.entity.Registration;
import vn.edu.crs.registration_service.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private static final String DA_DANG_KY = "DA_DANG_KY";
    private static final String DA_HUY = "DA_HUY";

    private final RegistrationRepository registrationRepository;
    private final CourseClient courseClient;

    public Registration register(RegistrationRequestDTO dto) {
        Optional<Registration> existingOpt = registrationRepository
                .findByStudentIdAndCourseId(dto.getStudentId(), dto.getCourseId());

        if (existingOpt.isPresent()) {
            Registration existing = existingOpt.get();
            if (DA_DANG_KY.equals(existing.getTrangThai())) {
                throw new IllegalStateException("Sinh vien da dang ky mon hoc nay roi");
            }

            courseClient.reserveSeat(dto.getCourseId());
            existing.setTrangThai(DA_DANG_KY);
            existing.setNgayDangKy(LocalDateTime.now());
            return registrationRepository.save(existing);
        }

        courseClient.reserveSeat(dto.getCourseId());

        Registration registration = new Registration();
        registration.setStudentId(dto.getStudentId());
        registration.setCourseId(dto.getCourseId());
        registration.setTrangThai(DA_DANG_KY);
        registration.setNgayDangKy(LocalDateTime.now());

        return registrationRepository.save(registration);
    }

    public void cancel(Long registrationId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new NoSuchElementException("Khong tim thay dang ky id = " + registrationId));

        if (DA_HUY.equals(registration.getTrangThai())) {
            throw new IllegalStateException("Dang ky nay da duoc huy truoc do");
        }

        courseClient.releaseSeat(registration.getCourseId());

        registration.setTrangThai(DA_HUY);
        registrationRepository.save(registration);
    }

    public List<Registration> getByStudentId(Long studentId) {
        return registrationRepository.findByStudentId(studentId);
    }

    public List<Registration> getMyRegistrations(Long studentId) {
        return registrationRepository.findByStudentId(studentId);
    }
}
