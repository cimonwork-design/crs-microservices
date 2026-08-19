# Hệ thống Đăng ký Học phần (CRS — Course Registration System)

Hệ thống Đăng ký Học phần được thiết kế và triển khai theo kiến trúc **Microservices** bằng **Spring Boot 3** và **MySQL Database**.

---

## 🏗 Kiến trúc Hệ thống (System Architecture)

Hệ thống bao gồm 2 microservice hiện tại (được mở rộng ở các bài học tiếp theo):

| Service | Cổng (Port) | Database | Trách nhiệm chính |
| :--- | :--- | :--- | :--- |
| **`course-service`** | `8082` | `course_db` | Quản lý thông tin học phần, tìm kiếm, phân trang, quản lý số chỗ còn lại (`soChoConLai`, `soChoToiDa`). |
| **`registration-service`** | `8083` | `registration_db` | Quản lý các lượt đăng ký học phần của sinh viên, xử lý hủy đăng ký và đăng ký lại, đồng bộ số chỗ với `course-service`. |

### Sơ đồ Giao tiếp Microservices

```
┌─────────────────────────┐               ┌─────────────────────────┐
│  registration-service   │               │     course-service      │
│      (Port: 8083)       │  REST (Feign) │      (Port: 8082)       │
│    [registration_db]    │──────────────►│       [course_db]       │
└─────────────────────────┘  PATCH        └─────────────────────────┘
  (Xử lý Đăng ký/Hủy)         reserve/release    (Trừ/Cộng số chỗ)
```

---

## 🛠 Yêu cầu Môi trường (Prerequisites)

- **Java Development Kit (JDK)**: Java 17 trở lên.
- **Maven**: 3.8+ (hoặc dùng `mvnw` / `mvnw.cmd` có sẵn trong từng service).
- **MySQL Server**: 8.0 trở lên (hoặc Docker Engine nếu dùng Docker Compose).

---

## 🗄 Hướng dẫn Thiết lập Database (Database Setup)

### Cách 1: Dùng Docker Compose (Khuyên dùng)

Hệ thống đã chuẩn bị sẵn file `docker-compose.yml` và script tự động tạo cơ sở dữ liệu `init-db.sql`.

1. Mở Terminal tại thư mục gốc của dự án:
   ```bash
   docker-compose up -d
   ```
2. Docker sẽ khởi chạy container MySQL `crs-mysql` tại cổng `3306` (User: `root`, Password: `root`) và tự động tạo 2 cơ sở dữ liệu:
   - `course_db`
   - `registration_db`

### Cách 2: Thiết lập Thủ công trên MySQL Local

Nếu bạn chạy MySQL trực tiếp trên máy local:
1. Mở MySQL Client (Workbench, DBeaver, Command Line,...).
2. Chạy câu lệnh SQL từ file `init-db.sql`:
   ```sql
   CREATE DATABASE IF NOT EXISTS course_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE DATABASE IF NOT EXISTS registration_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

---

## 🚀 Hướng dẫn Chạy Dự án (How to Run)

### 1. Khởi chạy `course-service`

```bash
cd course-service
./mvnw spring-boot:run
```
*(Trên Windows PowerShell: `.\mvnw.cmd spring-boot:run`)*

Service sẽ chạy tại: **`http://localhost:8082`**

### 2. Khởi chạy `registration-service`

```bash
cd registration-service
./mvnw spring-boot:run
```
*(Trên Windows PowerShell: `.\mvnw.cmd spring-boot:run`)*

Service sẽ chạy tại: **`http://localhost:8083`**

---

## 📌 Luồng Nghiệp vụ Đăng ký & Hủy Đăng ký (Business Logic)

1. **Đăng ký Học phần (`POST /registrations`)**:
   - Kiểm tra xem sinh viên đã có bản ghi đăng ký với môn học này chưa.
   - **Đăng ký lần đầu**: Nếu chưa từng đăng ký, hệ thống kiểm tra và gọi `course-service` (`PATCH /internal/courses/{id}/reserve-seat`) để giảm `soChoConLai`. Sau đó tạo bản ghi mới với trạng thái `DA_DANG_KY`.
   - **Đăng ký lại sau khi Hủy**: Nếu bản ghi cũ đang ở trạng thái `DA_HUY`, hệ thống gọi `course-service` trừ chỗ và cập nhật trạng thái của bản ghi đó trở lại `DA_DANG_KY` kèm theo thời gian `ngayDangKy` mới nhất.
   - **Trùng lặp**: Nếu bản ghi đang ở trạng thái `DA_DANG_KY`, hệ thống báo lỗi *"Sinh viên đã đăng ký môn học này rồi"*.

2. **Hủy Đăng ký (`DELETE /registrations/{id}`)**:
   - Kiểm tra sự tồn tại của bản ghi đăng ký.
   - Gọi `course-service` (`PATCH /internal/courses/{id}/release-seat`) để hoàn trả +1 cho `soChoConLai`.
   - Chuyển trạng thái bản ghi thành `DA_HUY`.

---

## 📖 Chi tiết REST API Endpoints

### 1. `course-service` (Port 8082)

- **`GET /courses`**: Lấy danh sách tất cả môn học.
- **`GET /courses?keyword={name}&page=0&size=10`**: Tìm kiếm theo tên môn học & phân trang.
- **`GET /courses/{id}`**: Lấy chi tiết môn học theo ID.
- **`POST /courses`**: Tạo môn học mới.
  - Body Request:
    ```json
    {
      "tenMonHoc": "Lập trình Java",
      "soTinChi": 3,
      "soChoToiDa": 30
    }
    ```
- **`PUT /courses/{id}`**: Cập nhật thông tin môn học.
- **`DELETE /courses/{id}`**: Xóa môn học.
- **`PATCH /internal/courses/{id}/reserve-seat`**: API nội bộ trừ số chỗ còn lại đi 1.
- **`PATCH /internal/courses/{id}/release-seat`**: API nội bộ tăng số chỗ còn lại thêm 1.

### 2. `registration-service` (Port 8083)

- **`POST /registrations`**: Thực hiện đăng ký / đăng ký lại môn học.
  - Body Request:
    ```json
    {
      "studentId": 1,
      "courseId": 1
    }
    ```
  - Response (201 Created):
    ```json
    {
      "id": 1,
      "studentId": 1,
      "courseId": 1,
      "trangThai": "DA_DANG_KY",
      "ngayDangKy": "2026-08-11T13:30:00"
    }
    ```
- **`DELETE /registrations/{id}`**: Hủy đăng ký học phần (200 OK).

---

## 🧪 Kiểm thử với Postman (Postman Collections)

Bộ bộ sưu tập API Postman có sẵn trong thư mục `docs/`:
- `docs/course-service.postman_collection.json`
- `docs/registration-service.postman_collection.json`

Bạn có thể import 2 file này vào Postman để tiến hành test các luồng API.
