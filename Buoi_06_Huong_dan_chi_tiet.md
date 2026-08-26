# HƯỚNG DẪN CHI TIẾT BUỔI 6: GIAO DIỆN DANH SÁCH MÔN HỌC, TÌM KIẾM & PHÂN TRANG

> Tài liệu này hướng dẫn chi tiết toàn bộ các bước thực hiện Buổi 6, danh sách công cụ cần cài đặt (khi máy mới xóa hết), cách chạy toàn bộ các microservices và frontend, cách tạo dữ liệu mẫu với Postman và kịch bản demo 4 trạng thái.
>
> 📖 Bản chi tiết nằm tại: [docs/buoi-06-giao-dien-danh-sach-mon-hoc.md](file:///d:/Phat_Trien_Phan_Mem_Huong_Dich_Vu/crs-microservices/docs/buoi-06-giao-dien-danh-sach-mon-hoc.md)

---

## 📌 I. TỔNG QUAN CÁC FILE ĐÃ TẠO / CẬP NHẬT TRONG CRS-FRONTEND

1. [useCourses.ts](file:///d:/Phat_Trien_Phan_Mem_Huong_Dich_Vu/crs-microservices/crs-frontend/src/api/useCourses.ts) - Custom hook quản lý gọi API `GET /api/courses` qua Gateway và 4 trạng thái: `loading`, `success`, `empty`, `error`.
2. [SearchBox.tsx](file:///d:/Phat_Trien_Phan_Mem_Huong_Dich_Vu/crs-microservices/crs-frontend/src/components/SearchBox.tsx) - Ô tìm kiếm môn học có Debounce 400ms.
3. [Pagination.tsx](file:///d:/Phat_Trien_Phan_Mem_Huong_Dich_Vu/crs-microservices/crs-frontend/src/components/Pagination.tsx) - Điều hướng phân trang độc lập.
4. [CourseList.tsx](file:///d:/Phat_Trien_Phan_Mem_Huong_Dich_Vu/crs-microservices/crs-frontend/src/components/CourseList.tsx) - Hiển thị danh sách môn học và xử lý giao diện theo 4 trạng thái.
5. [App.tsx](file:///d:/Phat_Trien_Phan_Mem_Huong_Dich_Vu/crs-microservices/crs-frontend/src/App.tsx) - Ráp nối `SearchBox`, `CourseList`, `Pagination` và hook `useCourses`.

---

## 🛠️ II. CÔNG CỤ CẦN CÀI ĐẶT (KHI MỚI XÓA CÔNG CỤ)

1. **JDK 21 hoặc 25**: [Tải Eclipse Temurin JDK](https://adoptium.net/) (chọn bản .msi cho Windows, tích chọn *Set JAVA_HOME* và *Add to PATH*).
2. **Node.js 20+ hoặc 22 LTS**: [Tải Node.js](https://nodejs.org/en/download).
3. **Docker Desktop** (hoặc MySQL Server 8.0): [Tải Docker Desktop](https://www.docker.com/products/docker-desktop/).
4. **Postman**: [Tải Postman](https://www.postman.com/downloads/).
5. **IntelliJ IDEA Community / Ultimate** (hoặc VS Code): [Tải IntelliJ IDEA](https://www.jetbrains.com/idea/download/).

---

## 🚀 III. QUY TRÌNH CHẠY DỰ ÁN

### 1. Bật MySQL
```powershell
# Chạy tại thư mục gốc crs-microservices
docker compose up -d
```

### 2. Chạy 4 Backend Microservices
Mở trong IntelliJ hoặc dùng PowerShell:
1. `auth-service` (Port 8081): `cd auth-service; .\mvnw spring-boot:run`
2. `course-service` (Port 8082): `cd course-service; .\mvnw spring-boot:run`
3. `registration-service` (Port 8083): `cd registration-service; .\mvnw spring-boot:run`
4. `api-gateway` (Port 8080): `cd api-gateway; .\mvnw spring-boot:run`

### 3. Chạy Frontend
```powershell
cd crs-frontend
npm install
npm run dev
```
Truy cập: `http://localhost:5173`

---

## 🧪 IV. TẠO DỮ LIỆU BẰNG POSTMAN ĐỂ DEMO
1. **Đăng ký Admin**: `POST http://localhost:8080/api/auth/register` (body: `{"username":"admin","password":"password123","email":"admin@crs.edu.vn","role":"ROLE_ADMIN"}`)
2. **Đăng nhập**: `POST http://localhost:8080/api/auth/login` (body: `{"username":"admin","password":"password123"}`) -> Lấy `token`.
3. **Tạo môn học**: `POST http://localhost:8080/api/courses` với header `Authorization: Bearer <token>`
   - Body mẫu:
   ```json
   {
     "tenMonHoc": "Kien truc Microservices",
     "soTinChi": 3,
     "soChoToiDa": 40,
     "soChoConLai": 15
   }
   ```
   *(Tạo khoảng 12-15 môn học để test phân trang)*.

---

## 📋 V. KỊCH BẢN DEMO 4 TRẠNG THÁI
1. **Loading -> Success**: Tải trang `http://localhost:5173`, thấy chữ `Dang tai danh sach mon hoc...` rồi hiện bảng danh sách.
2. **Empty**: Gõ tìm kiếm `zzz999` -> sau 400ms hiện `Khong tim thay mon hoc nao phu hop.`.
3. **Phân trang**: Bấm qua trang 2, 3 -> danh sách đổi và số trang in đậm.
4. **Error**: Tắt `api-gateway` -> bấm nút `Thu lai` -> hiện lỗi `Khong ket noi duoc toi he thong. Vui long thu lai sau.` và không bị crash trang. Bật lại gateway và bấm `Thu lai` -> trang phục hồi thành công.
