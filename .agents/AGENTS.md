# CRS Microservices - Project Rules

## Code Style
- Không viết comment trong code Java (trừ annotation)
- Message lỗi, tên biến, tên hằng viết tiếng Việt không dấu (VD: "Khong tim thay mon hoc")
- Tất cả service dùng cùng Spring Boot version 4.1.0, Java 25
- Package name dùng underscore thay hyphen: `vn.edu.crs.course_service`, `vn.edu.crs.registration_service`, `vn.edu.crs.auth_service`, `vn.edu.crs.api_gateway`

## Architecture
- Cấu trúc package: entity, dto, repository, service, controller, exception, config, security, client
- Dùng Lombok: @Data, @NoArgsConstructor, @AllArgsConstructor, @RequiredArgsConstructor
- GlobalExceptionHandler trả JSON format: `{"message": "..."}` nhất quán xuyên suốt hệ thống
- API nội bộ (giữa các service) đặt prefix `/internal/`
- Không dùng @ManyToOne xuyên database, chỉ lưu ID dạng Long

## Database
- MySQL, port 3306, username root, password root
- Mỗi service 1 database riêng: course_db, registration_db, auth_db
- Dùng `createDatabaseIfNotExist=true` trong datasource URL
- `spring.jpa.hibernate.ddl-auto=update`

## Security (Buổi 4+)
- JWT secret phải giống nhau ở tất cả service: `CRS-Microservices-Secret-Key-Nam-3-Hoc-Ky-2026-Doi-Trong-Thuc-Te`
- Mỗi service tự verify JWT độc lập (Zero Trust)
- JJWT version 0.12.6

## Service Ports
- api-gateway: 8080
- auth-service: 8081
- course-service: 8082
- registration-service: 8083
