package vn.edu.crs.registration_service.repository;

import vn.edu.crs.registration_service.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByStudentId(Long studentId);

    Optional<Registration> findByStudentIdAndCourseId(Long studentId, Long courseId);

    boolean existsByStudentIdAndCourseIdAndTrangThai(Long studentId, Long courseId, String trangThai);
}
