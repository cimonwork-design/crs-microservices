# Blueprint API — Hệ thống Đăng ký Học phần (CRS)

> **Phiên bản:** 1.0 — Buổi 1  
> **Ngày tạo:** 2026-08-03  
> **Mục đích:** Liệt kê toàn bộ endpoint dự kiến cho cả hệ thống, bao gồm cả API nội bộ giữa các service. Blueprint này sẽ được cập nhật dần qua các buổi học.

---

## 1. auth-service

> **Cổng:** 8081  
> **Tiền tố khi qua Gateway:** `/api/auth`

| Method | Endpoint         | Mô tả                      | Yêu cầu xác thực |
|--------|------------------|-----------------------------|--------------------|
| POST   | `/auth/login`    | Đăng nhập, trả về JWT       | Public             |
| POST   | `/auth/register` | Đăng ký tài khoản (tuỳ chọn)| Public             |

---

## 2. course-service

> **Cổng:** 8082  
> **Tiền tố khi qua Gateway:** `/api/courses`

### 2.1. API công khai (expose qua Gateway)

| Method | Endpoint         | Mô tả                              | Yêu cầu xác thực |
|--------|------------------|-------------------------------------|--------------------|
| GET    | `/courses`       | Danh sách môn học, hỗ trợ search + phân trang | Public    |
| GET    | `/courses/{id}`  | Chi tiết 1 môn học                  | Public             |
| POST   | `/courses`       | Thêm môn học mới                    | ADMIN              |
| PUT    | `/courses/{id}`  | Sửa thông tin môn học               | ADMIN              |
| DELETE | `/courses/{id}`  | Xoá môn học                         | ADMIN              |

### 2.2. API nội bộ (KHÔNG expose qua Gateway)

> Chỉ được gọi từ `registration-service` trong mạng nội bộ.

| Method | Endpoint                              | Mô tả                                                        |
|--------|---------------------------------------|---------------------------------------------------------------|
| PATCH  | `/internal/courses/{id}/reserve-seat` | Kiểm tra còn chỗ → trừ `soChoConLai` đi 1 (transactional)   |
| PATCH  | `/internal/courses/{id}/release-seat` | Hoàn trả 1 chỗ khi huỷ đăng ký → cộng `soChoConLai` lên 1   |

**Chi tiết luồng reserve-seat:**
1. `registration-service` gửi `PATCH /internal/courses/{courseId}/reserve-seat`
2. `course-service` kiểm tra `soChoConLai > 0`
   - Nếu **có chỗ**: trừ `soChoConLai` đi 1, trả về `200 OK`
   - Nếu **hết chỗ**: trả về `409 Conflict` (không thay đổi dữ liệu)

---

## 3. registration-service

> **Cổng:** 8083  
> **Tiền tố khi qua Gateway:** `/api/registrations`

| Method | Endpoint              | Mô tả                                                    | Yêu cầu xác thực |
|--------|-----------------------|-----------------------------------------------------------|--------------------|
| POST   | `/registrations`      | Đăng ký học phần (gọi ngầm `reserve-seat` sang course-service) | STUDENT       |
| GET    | `/registrations/my`   | Danh sách đăng ký của sinh viên đang đăng nhập            | STUDENT            |
| DELETE | `/registrations/{id}` | Huỷ đăng ký (gọi ngầm `release-seat` sang course-service) | STUDENT / ADMIN   |

**Chi tiết luồng đăng ký học phần (POST /registrations):**
```
Student ──► Gateway ──► registration-service ──► course-service
  │                          │                        │
  │  POST /api/registrations │  PATCH /internal/       │
  │ ─────────────────────►   │  courses/{id}/          │
  │                          │  reserve-seat           │
  │                          │ ──────────────────────► │
  │                          │     200 OK / 409        │
  │                          │ ◄────────────────────── │
  │    201 Created / 409     │                         │
  │ ◄─────────────────────── │                         │
```

---

## 4. api-gateway

> **Cổng:** 8080  
> **Không có database**

| Chức năng              | Mô tả                                                              |
|------------------------|--------------------------------------------------------------------|
| Định tuyến (Routing)   | Forward request đến service tương ứng dựa trên URL prefix          |
| Xác thực JWT sơ bộ     | Kiểm tra token hợp lệ trước khi forward (trừ các endpoint public) |
| CORS                   | Xử lý Cross-Origin cho frontend                                   |
| API Key (tuỳ chọn)     | Xác thực đối tác ngoài qua `/api/public/courses`                  |

---

## Tổng hợp toàn bộ Endpoint

| #  | Service              | Method | Endpoint                                | Quyền          |
|----|----------------------|--------|-----------------------------------------|----------------|
| 1  | auth-service         | POST   | `/auth/login`                           | Public         |
| 2  | auth-service         | POST   | `/auth/register`                        | Public         |
| 3  | course-service       | GET    | `/courses`                              | Public         |
| 4  | course-service       | GET    | `/courses/{id}`                         | Public         |
| 5  | course-service       | POST   | `/courses`                              | ADMIN          |
| 6  | course-service       | PUT    | `/courses/{id}`                         | ADMIN          |
| 7  | course-service       | DELETE | `/courses/{id}`                         | ADMIN          |
| 8  | course-service       | PATCH  | `/internal/courses/{id}/reserve-seat`   | Nội bộ         |
| 9  | course-service       | PATCH  | `/internal/courses/{id}/release-seat`   | Nội bộ         |
| 10 | registration-service | POST   | `/registrations`                        | STUDENT        |
| 11 | registration-service | GET    | `/registrations/my`                     | STUDENT        |
| 12 | registration-service | DELETE | `/registrations/{id}`                   | STUDENT/ADMIN  |
