# Thiết kế biên giới Service — Hệ thống Đăng ký Học phần (CRS)

> **Phiên bản:** 1.0 — Buổi 1  
> **Ngày tạo:** 2026-08-03  
> **Mục đích:** Xác định ranh giới trách nhiệm, quyền sở hữu dữ liệu và luồng giao tiếp giữa các service trong hệ thống CRS Microservices.

---

## 1. Danh sách Service

| Service                | Cổng | Database            | Trách nhiệm chính                                                        |
|------------------------|------|---------------------|---------------------------------------------------------------------------|
| **api-gateway**        | 8080 | *(không có DB)*     | Điểm vào duy nhất, định tuyến request, xác thực JWT sơ bộ, xử lý CORS   |
| **auth-service**       | 8081 | `auth_db`           | Quản lý User, Student, đăng nhập, sinh và xác thực JWT                   |
| **course-service**     | 8082 | `course_db`         | Quản lý Course, tìm kiếm, phân trang, quản lý số chỗ còn lại            |
| **registration-service** | 8083 | `registration_db` | Quản lý Registration, gọi sang course-service để đặt chỗ / hoàn trả chỗ |

---

## 2. Nguyên tắc sở hữu dữ liệu (Data Ownership)

1. **Mỗi service sở hữu một database riêng biệt** — KHÔNG service nào được truy cập trực tiếp database của service khác.
2. **Giao tiếp qua REST API** — Muốn đọc hoặc thay đổi dữ liệu thuộc service khác → PHẢI gọi REST API sang service đó.
3. **Chỉ lưu ID tham chiếu** — Ví dụ cụ thể: `registration-service` KHÔNG có bảng `Course`, chỉ lưu `courseId` (kiểu số nguyên, không có khoá ngoại thật đến `course_db`).

### Sơ đồ giao tiếp giữa các service

```
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │ HTTP
       ▼
┌──────────────┐
│ api-gateway  │ :8080
│ (không có DB)│
└──┬───┬───┬───┘
   │   │   │
   │   │   └──────────────────────┐
   │   │                          │
   ▼   ▼                          ▼
┌──────────┐  ┌──────────────┐  ┌──────────────────────┐
│auth-svc  │  │ course-svc   │  │ registration-svc     │
│:8081     │  │ :8082        │  │ :8083                │
│[auth_db] │  │ [course_db]  │  │ [registration_db]    │
└──────────┘  └──────────────┘  └──────────┬───────────┘
                     ▲                      │
                     │   REST API nội bộ    │
                     │  (reserve/release)   │
                     └──────────────────────┘
```

---

## 3. Bảng định tuyến Gateway (dự kiến)

| Route                  | Forward tới              | Ghi chú                                          |
|------------------------|--------------------------|--------------------------------------------------|
| `/api/auth/**`         | `http://localhost:8081`   | `POST /auth/login` là Public, phần còn lại cần JWT |
| `/api/courses/**`      | `http://localhost:8082`   | GET public, POST/PUT/DELETE cần role ADMIN        |
| `/api/registrations/**`| `http://localhost:8083`   | Cần JWT (role STUDENT hoặc ADMIN)                 |
| `/api/public/courses`  | `http://localhost:8082`   | Dùng API Key, dành cho đối tác bên ngoài          |

> **Lưu ý:** Các API nội bộ (prefix `/internal/`) KHÔNG được expose qua Gateway — chỉ cho phép gọi trực tiếp giữa các service trong mạng nội bộ.

---

## 4. Chi tiết Database từng Service

### 4.1. auth_db (auth-service)

| Bảng      | Mô tả                                     |
|-----------|--------------------------------------------|
| `user`    | Thông tin đăng nhập: username, password, role |
| `student` | Thông tin sinh viên: mã SV, họ tên, email  |

### 4.2. course_db (course-service)

| Bảng     | Mô tả                                                      |
|----------|-------------------------------------------------------------|
| `course` | Thông tin môn học: tên, số tín chỉ, số chỗ tối đa, số chỗ còn lại |

### 4.3. registration_db (registration-service)

| Bảng           | Mô tả                                                             |
|----------------|--------------------------------------------------------------------|
| `registration` | Bản ghi đăng ký: studentId, courseId, thời gian đăng ký, trạng thái |

> `courseId` trong bảng `registration` chỉ là giá trị số tham chiếu, **KHÔNG** có foreign key constraint sang `course_db`.
