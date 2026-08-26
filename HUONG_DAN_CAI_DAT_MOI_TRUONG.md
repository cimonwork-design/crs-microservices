# HƯỚNG DẪN CÀI ĐẶT MÔI TRƯỜNG & CÔNG CỤ CHẠY DỰ ÁN CRS MICROSERVICES

> **Dành cho:** Máy tính mới hoặc máy tính vừa gỡ bỏ toàn bộ công cụ phát triển.  
> **Dự án:** Hệ thống Đăng ký Môn học (CRS - Course Registration System) Microservices.

---

## 📑 MỤC LỤC
1. [Tổng quan hệ sinh thái công nghệ](#1-tổng-quan-hệ-sinh-thái-công-nghệ)
2. [Danh sách công cụ bắt buộc cần cài đặt](#2-danh-sách-công-cụ-bắt-buộc-cần-cài-đặt)
3. [Hướng dẫn cài đặt chi tiết từng công cụ](#3-hướng-dẫn-cài-đặt-chi-tiết-từng-công-cụ)
   - [3.1. Java Development Kit (JDK 21 hoặc 25)](#31-java-development-kit-jdk-21-hoặc-25)
   - [3.2. Node.js & npm (LTS Version)](#32-nodejs--npm-lts-version)
   - [3.3. Docker Desktop (hoặc MySQL Server 8.0)](#33-docker-desktop-hoặc-mysql-server-80)
   - [3.4. Postman (API Testing)](#34-postman-api-testing)
   - [3.5. IntelliJ IDEA Community (hoặc VS Code)](#35-intellij-idea-community-hoặc-vs-code)
4. [Kiểm tra môi trường sau khi cài đặt](#4-kiểm-tra-môi-trường-sau-khi-cài-đặt)
5. [Quy trình khởi chạy dự án từ con số 0](#5-quy-trình-khởi-chạy-dự-án-từ-con-số-0)
6. [Bảng tra cứu Port & Thông tin kết nối](#6-bảng-tra-cứu-port--thông-tin-kết-nối)

---

## 1. TỔNG QUAN HỆ SINH THÁI CÔNG NGHỆ

Dự án CRS được xây dựng theo kiến trúc Microservices gồm:
- **Backend**: 4 dịch vụ Spring Boot (Java 25, Spring Boot 4.1.0, JJWT 0.12.6, Lombok, Spring Data JPA).
- **Database**: 3 database MySQL độc lập (`auth_db`, `course_db`, `registration_db`).
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Axios.
- **Gateway**: Spring Cloud Gateway (WebFlux) điều phối toàn bộ traffic qua cổng `8080`.

```
                  +-------------------------+
                  |  Frontend (Port 5173)   |
                  +------------+------------+
                               |
                               v
                  +-------------------------+
                  |   API Gateway (Port 8080)|
                  +------------+------------+
                               |
        +----------------------+----------------------+
        |                      |                      |
        v                      v                      v
+---------------+      +---------------+      +----------------------+
| auth-service  |      |course-service |      | registration-service |
|  (Port 8081)  |      |  (Port 8082)  |      |     (Port 8083)      |
+-------+-------+      +-------+-------+      +----------+-----------+
        |                      |                         |
        v                      v                         v
   [ auth_db ]           [ course_db ]          [ registration_db ]
```

---

## 2. DANH SÁCH CÔNG CỤ BẮT BUỘC CẦN CÀI ĐẶT

| STT | Công cụ | Phiên bản khuyến nghị | Mục đích sử dụng | Link tải chính thức |
|---|---|---|---|---|
| **1** | **JDK** | Java 21 LTS hoặc Java 25 | Chạy 4 Backend Microservices | [Eclipse Temurin](https://adoptium.net/) / [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) |
| **2** | **Node.js** | v20.x hoặc v22.x (LTS) | Chạy React / Vite Frontend | [Nodejs.org](https://nodejs.org/en/download) |
| **3** | **Docker Desktop** | Bản mới nhất cho Windows | Khởi tạo MySQL tự động qua docker-compose | [Docker Desktop](https://www.docker.com/products/docker-desktop/) |
| **4** | **Postman** | Bản mới nhất | Test API, cấp Token, tạo dữ liệu demo | [Postman.com](https://www.postman.com/downloads/) |
| **5** | **IntelliJ IDEA** | Community (Free) hoặc Ultimate | IDE lập trình và quản lý các service Java | [JetBrains IntelliJ](https://www.jetbrains.com/idea/download/) |
| **6** | **Git** | 2.40+ (Đã có sẵn trên máy) | Quản lý mã nguồn | [Git SCM](https://git-scm.com/) |

---

## 3. HƯỚNG DẪN CÀI ĐẶT CHI TIẾT TỪNG CÔNG CỤ

### 3.1. Java Development Kit (JDK 21 hoặc 25)
1. Truy cập [Adoptium Temurin](https://adoptium.net/temurin/releases/) hoặc [Oracle JDK 21 / 25](https://www.oracle.com/java/technologies/downloads/#java25).
2. Tải bản cài đặt Windows **`.msi`** (hoặc `.exe`).
3. Khi cài đặt, **đặc biệt chú ý** bật các tùy chọn:
   - ✅ **Add to PATH**
   - ✅ **Set JAVA_HOME variable**
4. Hoàn tất cài đặt và khởi động lại terminal/PowerShell.

---

### 3.2. Node.js & npm (LTS Version)
1. Truy cập [Nodejs.org](https://nodejs.org/en/download).
2. Chọn bản **LTS (Long Term Support)** (ví dụ: v20.x.x hoặc v22.x.x) cho Windows x64.
3. Chạy file `.msi` vừa tải, nhấn **Next** theo mặc định (tự động tích hợp sẵn `npm` và thêm vào `PATH`).

---

### 3.3. Docker Desktop (Khuyên dùng cho Database)
1. Truy cập [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/).
2. Tải và chạy bộ cài đặt.
3. Đảm bảo máy tính đã bật **WSL 2** (Windows Subsystem for Linux).
4. Sau khi cài xong, khởi động Docker Desktop.
5. Khi Docker đã chạy (biểu tượng cá voi màu xanh lá cây ở thanh taskbar), bạn chỉ cần gõ 1 lệnh là có toàn bộ 3 database:
   ```powershell
   cd d:\Phat_Trien_Phan_Mem_Huong_Dich_Vu\crs-microservices
   docker compose up -d
   ```

*(Nếu không muốn dùng Docker, bạn có thể cài **MySQL Community Server 8.0** trực tiếp, đặt mật khẩu tài khoản `root` là `root`, port `3306` và chạy file `init-db.sql`)*.

---

### 3.4. Postman (API Testing)
1. Truy cập [Postman Downloads](https://www.postman.com/downloads/).
2. Tải và cài đặt file `.exe`.
3. Đăng nhập (hoặc chọn dùng tài khoản Google miễn phí).
4. Dùng Postman để gọi API đăng ký, đăng nhập và tạo môn học mẫu.

---

### 3.5. IntelliJ IDEA Community (hoặc VS Code)
1. Truy cập [JetBrains IntelliJ Download](https://www.jetbrains.com/idea/download/).
2. Cuộn xuống mục **IntelliJ IDEA Community Edition** (Bản miễn phí hoàn toàn) và tải về.
3. Cài đặt và mở thư mục `crs-microservices`.
4. IntelliJ sẽ tự động nhận diện Maven và tải các thư viện cần thiết.

---

## 4. KIỂM TRA MÔI TRƯỜNG SAU KHI CÀI ĐẶT

Mở **PowerShell** mới và chạy các lệnh kiểm tra sau:

```powershell
# 1. Kiểm tra Java (phải hiện version >= 21 hoặc 25)
java -version

# 2. Kiểm tra Node.js và npm
node -v
npm -v

# 3. Kiểm tra Docker
docker -v
docker compose version

# 4. Kiểm tra Git
git --version
```

Nếu tất cả các lệnh trên đều hiển thị phiên bản thành công mà không báo lỗi `is not recognized`, môi trường của bạn đã hoàn toàn sẵn sàng! 🎉

---

## 5. QUY TRÌNH KHỞI CHẠY DỰ ÁN TỪ CON SỐ 0

### 🟢 Bước 1: Khởi động MySQL Database
Mở PowerShell tại thư mục gốc của dự án:
```powershell
cd d:\Phat_Trien_Phan_Mem_Huong_Dich_Vu\crs-microservices
docker compose up -d
```

---

### 🟢 Bước 2: Chạy 4 Backend Microservices
Mở 4 tab PowerShell riêng biệt (hoặc nhấn nút Run trong IntelliJ):

- **Tab 1 - auth-service (Port 8081)**:
  ```powershell
  cd auth-service
  .\mvnw spring-boot:run
  ```
- **Tab 2 - course-service (Port 8082)**:
  ```powershell
  cd course-service
  .\mvnw spring-boot:run
  ```
- **Tab 3 - registration-service (Port 8083)**:
  ```powershell
  cd registration-service
  .\mvnw spring-boot:run
  ```
- **Tab 4 - api-gateway (Port 8080)**:
  ```powershell
  cd api-gateway
  .\mvnw spring-boot:run
  ```

---

### 🟢 Bước 3: Chạy Frontend React
Mở Tab PowerShell thứ 5:
```powershell
cd crs-frontend
npm install
npm run dev
```
Mở trình duyệt truy cập: **`http://localhost:5173`**

---

### 🟢 Bước 4: Tạo dữ liệu mẫu qua Postman để demo
1. **Lấy Token Admin**:
   - `POST http://localhost:8080/api/auth/register` (body: `{"username":"admin","password":"password123","email":"admin@crs.edu.vn","role":"ROLE_ADMIN"}`)
   - `POST http://localhost:8080/api/auth/login` (body: `{"username":"admin","password":"password123"}`) ➔ Copy chuỗi `token`.
2. **Tạo môn học**:
   - `POST http://localhost:8080/api/courses`
   - Header: `Authorization: Bearer <token_copy>`, `Content-Type: application/json`
   - Body:
     ```json
     {
       "tenMonHoc": "Kien truc Microservices",
       "soTinChi": 3,
       "soChoToiDa": 40,
       "soChoConLai": 15
     }
     ```
   - Tạo từ 12-15 môn học để test tính năng phân trang trên Web.

---

## 6. BẢNG TRA CỨU PORT & THÔNG TIN KẾT NỐI

| Dịch vụ / Thành phần | Cổng (Port) | Địa chỉ URL | Ghi chú |
|---|---|---|---|
| **API Gateway** | `8080` | `http://localhost:8080` | Điểm truy cập duy nhất cho Frontend & Client |
| **Auth Service** | `8081` | `http://localhost:8081` | Quản lý tài khoản, JWT (Database `auth_db`) |
| **Course Service** | `8082` | `http://localhost:8082` | Quản lý danh sách môn học (Database `course_db`) |
| **Registration Service** | `8083` | `http://localhost:8083` | Đăng ký môn học (Database `registration_db`) |
| **Frontend React** | `5173` | `http://localhost:5173` | Giao diện người dùng Web |
| **MySQL Server** | `3306` | `localhost:3306` | User: `root`, Password: `root` |
| **JWT Secret Key** | - | `CRS-Microservices-Secret-Key-Nam-3-Hoc-Ky-2026-Doi-Trong-Thuc-Te` | Cấu hình đồng bộ giữa tất cả service |
